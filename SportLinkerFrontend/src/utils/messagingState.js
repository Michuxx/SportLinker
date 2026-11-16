import {
  chatKey,
  mergeMessages,
  withConversationPreview,
  sameMessage,
  sortConversations,
} from "./messaging.js";
import { compareMessagePositions, isMessageReadBy, mergeReadStates, normalizeReadState, unreadAfterReads } from "./conversationReads.js";

const applyReads = (state, id, incoming, snapshot = false) => {
  const key = `conversation:${id}`;
  const thread = state.threads[key] ?? emptyThread();
  const previous = thread.readStates ?? [];
  const readStates = mergeReadStates(previous, incoming);
  const ownPrevious = previous.some((read) => String(read.userId) === String(state.userId));
  const messages = snapshot && !ownPrevious ? thread.receivedMessages ?? [] : thread.items;
  const revision = state.revision + 1;
  const update = (chat) => chat?.id === id ? {
    ...chat, revision,
    unreadCount: unreadAfterReads(chat, messages, previous, readStates, state.userId),
  } : chat;
  return {
    ...state, revision,
    threads: { ...state.threads, [key]: { ...thread, readStates } },
    conversations: sortConversations(state.conversations.map(update)),
    activeChat: update(state.activeChat),
  };
};

export const emptyThread = () => ({
  items: [],
  loaded: false,
  loading: false,
  loadingOlder: false,
  error: false,
  olderError: false,
  hasMore: false,
  cursor: null,
  readStates: [],
  receivedMessages: [],
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
  presenceRevision: 0,
  imageLookupIds: userId ? [String(userId)] : [],
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
    if (action.list === "conversations") {
      items = items.map((chat) => {
        const thread = state.threads[`conversation:${chat.id}`] ?? emptyThread();
        const additional = thread.receivedMessages.filter((message) =>
          !message.isOwnMessage && String(message.senderId) !== String(state.userId) &&
          (!chat.lastMessage || compareMessagePositions(message, chat.lastMessage) > 0) &&
          !isMessageReadBy(thread.readStates, state.userId, message));
        return { ...chat, unreadBoundary: chat.lastMessage,
          unreadCount: unreadAfterReads(chat, [], [], thread.readStates, state.userId) + additional.length };
      });
    }
    // Keep local changes made while this GET was in flight.
    const local = state[action.list].filter(
      (item) => item.revision > action.revision,
    );
    items = [
      ...local.map((item) => {
        const fetched = items.find((other) => other.id === item.id);
        return action.list === "conversations" && fetched ? {
          ...fetched, ...item,
          ...(item.provisional ? { name: fetched.name, type: fetched.type,
            recipientUserId: fetched.recipientUserId, canSendMessages: fetched.canSendMessages, provisional: false } : {}),
          unreadCount: fetched.unreadCount,
          unreadBoundary: fetched.unreadBoundary,
        } : item;
      }),
      ...items.filter((item) => !local.some((other) => other.id === item.id)),
    ];
    const refreshedChat =
      action.list === "conversations" && state.activeChat?.id
        ? items.find((item) => item.id === state.activeChat.id)
        : null;
    const refreshedDraftFriend =
      action.list === "friends" &&
      state.activeChat?.type === "private" &&
      !state.activeChat.id
        ? items.find(
            (friend) =>
              String(friend.userId) ===
              String(state.activeChat.recipientUserId),
          )
        : null;
    return {
      ...state,
      imageLookupIds: [...new Set([...state.imageLookupIds, ...action.items.map((item) =>
        action.list === "friends" ? item.userId : item.type === "private" ? item.recipientUserId : null)
        .filter((id) => id != null).map(String)])],
      [action.list]: action.list === "conversations" ? sortConversations(items) : items,
      lists: { ...state.lists, [action.list]: "ready" },
      removedConversations:
        action.list === "conversations" ? removed : state.removedConversations,
      activeChat: refreshedChat
        ? { ...state.activeChat, ...refreshedChat }
        : refreshedDraftFriend
          ? {
              ...state.activeChat,
              isOnline: refreshedDraftFriend.isOnline,
              lastTimeOnline: refreshedDraftFriend.lastTimeOnline,
            }
          : state.activeChat,
    };
  }
  if (action.type === "select") return { ...state, activeChat: action.chat };

  if (action.type === "conversation/read") {
    if (String(action.userId) !== String(state.userId) ||
        state.removedConversations.includes(action.read.conversationId)) return state;
    const thread = state.threads[`conversation:${action.read.conversationId}`];
    const read = normalizeReadState(action.read, thread?.readStates ?? []);
    return read ? applyReads(state, read.conversationId, [read]) : state;
  }

  if (action.type === "presence/changed") {
    if (String(action.userId) !== String(state.userId)) {
      return state;
    }

    return {
      ...state,
      realtimeVersion: state.realtimeVersion + 1,
      presenceRevision: state.revision,
    };
  }

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

    if (state.removedConversations.includes(id) && !draftEntry) {
      return state;
    }

    const target = state.threads[key] ?? emptyThread();

    const items = mergeMessages(
      mergeMessages(target.items, draftEntry?.[1].items ?? []),
      [action.message],
    );

    const threads = {
      ...state.threads,
      [key]: { ...target, items, receivedMessages: mergeMessages(target.receivedMessages ?? [], [action.message]) },
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

    const duplicate = target.items.some((message) => sameMessage(message, action.message)) ||
      knownChat?.lastMessage?.id === action.message.id;
    const baselineIncludes = knownChat?.unreadBoundary && compareMessagePositions(action.message, knownChat.unreadBoundary) <= 0;
    const addUnread = !duplicate && !baselineIncludes && !action.message.isOwnMessage &&
      String(action.message.senderId) !== String(state.userId) &&
      !isMessageReadBy(target.readStates ?? [], state.userId, action.message);
    const metadata = action.conversation ?? {
      type: "unknown", name: "Nowa rozmowa", canSendMessages: false, provisional: true,
    };
    const chat = { ...metadata, ...knownChat, id, revision,
      unreadCount: (knownChat?.unreadCount ?? 0) + (addUnread ? 1 : 0) };

    const draftRecipientId = draftEntry
      ? Number(draftEntry[0].slice("friend:".length))
      : null;

    return {
      ...state,
      revision,
      threads,
      removedConversations: state.removedConversations.filter(
        (removedId) => removedId !== id,
      ),
      activeChat: activeDraft || state.activeChat?.id === id
        ? { ...state.activeChat, ...chat }
        : state.activeChat,
      conversations: withConversationPreview(state.conversations, chat, action.message),
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
      imageLookupIds: action.type === "thread/success" ? [...new Set([
        ...state.imageLookupIds, ...action.page.items.map((message) => message.senderId).filter((id) => id != null).map(String),
      ])] : state.imageLookupIds,
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
    return action.type === "thread/success"
      ? applyReads(result, Number(action.key.slice("conversation:".length)), action.page.readStates ?? [], true)
      : result;
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
