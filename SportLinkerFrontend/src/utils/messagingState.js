import {
  chatKey,
  mergeMessages,
  withConversationPreview,
  sameMessage,
} from "./messaging.js";

export const emptyThread = () => ({
  items: [],
  loaded: false,
  loading: false,
  loadingOlder: false,
  error: false,
  olderError: false,
  hasMore: false,
  cursor: null,
});
export const initialMessagingState = (userId) => ({
  userId,
  friends: [],
  conversations: [],
  activeChat: null,
  threads: {},
  lists: { friends: "loading", conversations: "loading" },
  deletingKey: null,
  removingFriendId: null,
  revision: 0,
  removedConversations: [],
  removedFriends: [],
  realtimeVersion: 0,
});

export const messagingReducer = (state, action) => {
  if (action.type === "reset") return initialMessagingState(action.userId);
  if (action.type === "list/loading" || action.type === "list/error")
    return {
      ...state,
      lists: {
        ...state.lists,
        [action.list]: action.type.endsWith("loading") ? "loading" : "error",
      },
    };
  if (action.type === "list/success") {
    let removed =
      action.list === "friends"
        ? state.removedFriends
        : state.removedConversations;
    if (action.list === "conversations" && action.revision >= state.revision) {
      removed = removed.filter(
        (id) => !action.items.some((item) => item.id === id),
      );
    }
    let items = action.items.filter((item) => !removed.includes(item.id));
    // Keep local changes made while this GET was in flight.
    const local = state[action.list].filter(
      (item) => item.revision > action.revision,
    );
    items = [
      ...local,
      ...items.filter((item) => !local.some((other) => other.id === item.id)),
    ];
    const refreshedChat =
      action.list === "conversations" && state.activeChat?.id
        ? items.find((item) => item.id === state.activeChat.id)
        : null;
    return {
      ...state,
      [action.list]: items,
      removedConversations:
        action.list === "conversations" ? removed : state.removedConversations,
      activeChat: refreshedChat
        ? { ...state.activeChat, ...refreshedChat }
        : state.activeChat,
      lists: { ...state.lists, [action.list]: "ready" },
    };
  }
  if (action.type === "select") return { ...state, activeChat: action.chat };

  if (action.type === "message/received") {
    if (String(action.userId) !== String(state.userId)) {
      return state;
    }

    const id = action.conversationId;
    const key = `conversation:${id}`;

    // Pierwsza wiadomość mogła dotrzeć, zanim HTTP zwróciło ID rozmowy.
    const draftEntry = Object.entries(state.threads).find(
      ([threadKey, thread]) =>
        threadKey.startsWith("friend:") &&
        thread.items.some((item) => sameMessage(item, action.message)),
    );

    const realtimeVersion = state.realtimeVersion + 1;

    if (state.removedConversations.includes(id) && !draftEntry) {
      return { ...state, realtimeVersion };
    }

    const target = state.threads[key] ?? emptyThread();

    const items = mergeMessages(
      mergeMessages(target.items, draftEntry?.[1].items ?? []),
      [action.message],
    );

    const threads = {
      ...state.threads,
      [key]: { ...target, items },
    };

    if (draftEntry) {
      delete threads[draftEntry[0]];
    }

    const activeDraft =
      draftEntry &&
      state.activeChat &&
      chatKey(state.activeChat) === draftEntry[0]
        ? state.activeChat
        : null;

    const knownChat =
      state.conversations.find((chat) => chat.id === id) ??
      (state.activeChat?.id === id ? state.activeChat : null) ??
      activeDraft;

    const revision = state.revision + 1;

    const chat = knownChat ? { ...knownChat, id, revision } : null;

    const draftRecipientId = draftEntry
      ? Number(draftEntry[0].slice("friend:".length))
      : null;

    return {
      ...state,
      revision,
      realtimeVersion,
      threads,
      removedConversations: state.removedConversations.filter(
        (removedId) => removedId !== id,
      ),
      activeChat: activeDraft
        ? { ...activeDraft, id, revision }
        : state.activeChat,
      conversations: chat
        ? withConversationPreview(state.conversations, chat, action.message)
        : state.conversations,
      friends: state.friends.map((friend) =>
        Number(friend.userId) === draftRecipientId
          ? { ...friend, conversationId: id, revision }
          : friend,
      ),
    };
  }

  if (action.type.startsWith("thread/")) {
    const thread = state.threads[action.key] ?? emptyThread();
    let updated;
    if (action.type === "thread/loading")
      updated = {
        ...thread,
        [action.older ? "loadingOlder" : "loading"]: true,
        error: false,
        olderError: false,
      };
    if (action.type === "thread/error")
      updated = {
        ...thread,
        loading: false,
        loadingOlder: false,
        [action.older ? "olderError" : "error"]: true,
      };
    if (action.type === "thread/success") {
      const gap =
        action.page.hasMore &&
        !action.page.items.some((incoming) =>
          thread.items.some((item) => sameMessage(item, incoming)),
        );

      const advanceCursor = action.older || !thread.loaded || gap;
      updated = {
        ...thread,
        items: mergeMessages(thread.items, action.page.items),
        loaded: true,
        loading: false,
        loadingOlder: false,
        error: false,
        olderError: false,
        hasMore: advanceCursor ? action.page.hasMore : thread.hasMore,
        cursor: advanceCursor ? action.page.cursor : thread.cursor,
      };
    }
    if (action.type === "thread/message")
      updated = {
        ...thread,
        items: mergeMessages(thread.items, [action.message]),
      };
    let result = {
      ...state,
      threads: { ...state.threads, [action.key]: updated },
    };
    if (
      action.type === "thread/success" &&
      !action.older &&
      action.page.items.length
    ) {
      const conversation =
        state.conversations.find((item) => chatKey(item) === action.key) ??
        (state.activeChat && chatKey(state.activeChat) === action.key
          ? state.activeChat
          : null);
      if (conversation) {
        const revision = state.revision + 1;
        result = {
          ...result,
          revision,
          conversations: withConversationPreview(
            state.conversations,
            { ...conversation, revision },
            action.page.items.at(-1),
          ),
        };
      }
    }
    return result;
  }
  if (action.type === "send/success") {
    const revision = state.revision + 1;
    const latestChat =
      state.conversations.find((item) => item.id === action.conversationId) ??
      (state.activeChat && chatKey(state.activeChat) === action.key
        ? state.activeChat
        : null);
    const chat = {
      ...action.chat,
      ...latestChat,
      id: action.conversationId,
      revision,
    };
    const key = chatKey(chat);
    const source = state.threads[action.key] ?? emptyThread();
    const target = state.threads[key] ?? source;
    const threads = {
      ...state.threads,
      [key]: {
        ...target,
        loaded: true,
        items: mergeMessages(mergeMessages(target.items, source.items), [
          { ...action.message, status: "sent" },
        ]),
      },
    };
    if (key !== action.key) delete threads[action.key];
    return {
      ...state,
      revision,
      threads,
      removedConversations: state.removedConversations.filter(
        (id) => id !== chat.id,
      ),
      activeChat:
        state.activeChat && chatKey(state.activeChat) === action.key
          ? chat
          : state.activeChat,
      conversations: withConversationPreview(
        state.conversations,
        chat,
        action.message,
      ),
      friends: state.friends.map((friend) =>
        friend.userId === chat.recipientUserId
          ? { ...friend, conversationId: chat.id, revision }
          : friend,
      ),
    };
  }
  if (action.type === "history/pending")
    return { ...state, deletingKey: action.key };
  if (action.type === "history/deleted") {
    const threads = { ...state.threads };
    delete threads[action.key];
    return {
      ...state,
      threads,
      revision: state.revision + 1,
      removedConversations: [...state.removedConversations, action.id],
      conversations: state.conversations.filter(
        (item) => item.id !== action.id,
      ),
      activeChat: state.activeChat?.id === action.id ? null : state.activeChat,
      friends: state.friends.map((friend) =>
        friend.conversationId === action.id
          ? { ...friend, conversationId: null, revision: state.revision + 1 }
          : friend,
      ),
    };
  }
  if (action.type === "friend/pending")
    return { ...state, removingFriendId: action.id };
  if (action.type === "friend/deleted") {
    const revision = state.revision + 1;
    const disable = (chat) =>
      chat?.recipientUserId === action.userId
        ? { ...chat, canSendMessages: false, revision }
        : chat;
    return {
      ...state,
      revision,
      friends: state.friends.filter((item) => item.id !== action.id),
      removedFriends: [...state.removedFriends, action.id],
      conversations: state.conversations.map(disable),
      activeChat: disable(state.activeChat),
    };
  }
  return state;
};
