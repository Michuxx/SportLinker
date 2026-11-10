import { useCallback, useEffect, useReducer, useRef } from "react";
import friendService from "../api/friendService";
import conversationService from "../api/conversationService";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../utils/apiErrorHelper";
import { chatKey, friendChat, normalizeConversation, normalizeFriend, normalizeMessagesPage } from "../utils/messaging";
import { emptyThread, initialMessagingState, messagingReducer } from "../utils/messagingState";
import useChatImages from "./useChatImages";

const useMessaging = (user) => {
  const userId = user?.id;
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(messagingReducer, userId, initialMessagingState);
  const sessionRef = useRef(null);
  const current = state.userId === userId;

  const loadList = useCallback(async (list, session, revision = 0) => {
    dispatch({ type: "list/loading", list });
    try {
      const data = list === "friends"
        ? await friendService.getFriends({ signal: session.controller.signal })
        : await conversationService.getConversations({ signal: session.controller.signal });
      if (!Array.isArray(data)) throw new Error("Nieprawidłowa lista.");
      if (!session.controller.signal.aborted) dispatch({ type: "list/success", list, revision, items: data.map(list === "friends" ? normalizeFriend : normalizeConversation) });
    } catch {
      if (!session.controller.signal.aborted) dispatch({ type: "list/error", list });
    }
  }, []);

  useEffect(() => {
    const session = { controller: new AbortController(), loads: new Set(), sends: new Set(), mutations: new Set() };
    sessionRef.current = session;
    dispatch({ type: "reset", userId });
    if (userId) {
      loadList("friends", session);
      loadList("conversations", session);
    }
    return () => { session.controller.abort(); };
  }, [userId, loadList]);

  const loadMessages = useCallback(async (chat, older = false) => {
    const session = sessionRef.current;
    if (!chat?.id || !current || !session || session.controller.signal.aborted) return;
    const key = chatKey(chat);
    const thread = state.threads[key] ?? emptyThread();
    if (session.loads.has(key) || (older && (!thread.hasMore || !thread.cursor))) return;
    session.loads.add(key);
    dispatch({ type: "thread/loading", key, older });
    try {
      const data = await conversationService.getMessages(chat.id, { signal: session.controller.signal, cursor: older ? thread.cursor : null });
      const page = normalizeMessagesPage(data);
      if (!session.controller.signal.aborted) dispatch({ type: "thread/success", key, older, page });
    } catch {
      if (!session.controller.signal.aborted) dispatch({ type: "thread/error", key, older });
    } finally {
      session.loads.delete(key);
    }
  }, [current, state.threads]);

  const activeChat = current ? state.activeChat : null;
  const activeKey = activeChat ? chatKey(activeChat) : null;
  const thread = state.threads[activeKey] ?? emptyThread();
  const images = useChatImages({ user, friends: current ? state.friends : [], conversations: current ? state.conversations : [], messages: current ? thread.items : [], activeChat });
  useEffect(() => {
    if (activeChat?.id && !thread.loaded && !thread.loading && !thread.error) loadMessages(activeChat);
  }, [activeChat, thread.loaded, thread.loading, thread.error, loadMessages]);

  const sendMessage = async (text, retryMessage = null) => {
    const session = sessionRef.current;
    const chat = activeChat;
    if (!chat || !userId || !current || chat.canSendMessages === false || !text.trim() || !session || session.controller.signal.aborted) return false;
    const key = chatKey(chat);
    if (session.sends.has(key) || session.mutations.has(key) || state.deletingKey === key || thread.loading || thread.error) return false;
    session.sends.add(key);
    const clientMessageId = retryMessage?.clientMessageId ?? crypto.randomUUID();
    const message = retryMessage ? { ...retryMessage, status: "pending" } : {
      id: `local:${clientMessageId}`, clientMessageId, senderId: userId, senderName: user.name ?? user.userName ?? "Ja", senderImageUrl: user.profileImage ?? user.imageUrl, text: text.trim(), timestamp: new Date().toISOString(), isOwnMessage: true, status: "pending",
    };
    dispatch({ type: "thread/message", key, message });
    try {
      let conversationId = chat.id;
      const body = { content: message.text, clientMessageId };
      if (conversationId) await conversationService.sendMessage({ ...body, conversationId }, { signal: session.controller.signal });
      else conversationId = await conversationService.createPrivate({ ...body, receiverId: chat.recipientUserId }, { signal: session.controller.signal });
      if (!session.controller.signal.aborted) dispatch({ type: "send/success", key, chat, conversationId, message });
      return true;
    } catch (error) {
      if (!session.controller.signal.aborted) {
        dispatch({ type: "thread/message", key, message: { ...message, status: "failed" } });
        showToast({ severity: "error", summary: "Wiadomość nie została wysłana", detail: getErrorMessage(error, "Spróbuj wysłać wiadomość ponownie.") });
      }
      return false;
    } finally {
      session.sends.delete(key);
    }
  };

  const deleteHistory = async () => {
    const session = sessionRef.current;
    const chat = activeChat;
    if (!chat?.id || !session || session.controller.signal.aborted) return;
    const key = chatKey(chat);
    if (session.sends.has(key) || session.loads.has(key) || session.mutations.has("history")) return;
    session.mutations.add("history");
    session.mutations.add(key);
    dispatch({ type: "history/pending", key });
    try {
      await conversationService.deleteHistory(chat.id, { signal: session.controller.signal });
      if (!session.controller.signal.aborted) {
        dispatch({ type: "history/deleted", key, id: chat.id });
        showToast({ severity: "success", summary: "Historia rozmowy", detail: "Rozmowa została usunięta z Twojej historii." });
      }
    } catch (error) {
      if (!session.controller.signal.aborted) showToast({ severity: "error", summary: "Nie udało się usunąć historii", detail: getErrorMessage(error) });
    } finally {
      session.mutations.delete(key);
      session.mutations.delete("history");
      if (!session.controller.signal.aborted) dispatch({ type: "history/pending", key: null });
    }
  };

  const removeFriend = async (friend) => {
    const session = sessionRef.current;
    if (!current || !session || session.controller.signal.aborted || session.mutations.has("friend")) return;
    session.mutations.add("friend");
    dispatch({ type: "friend/pending", id: friend.id });
    try {
      await friendService.delete({ friendId: friend.userId }, { signal: session.controller.signal });
      if (!session.controller.signal.aborted) {
        dispatch({ type: "friend/deleted", id: friend.id, userId: friend.userId });
        showToast({ severity: "success", summary: "Znajomi", detail: "Użytkownik został usunięty ze znajomych." });
      }
    } catch (error) {
      if (!session.controller.signal.aborted) showToast({ severity: "error", summary: "Nie udało się usunąć znajomego", detail: getErrorMessage(error) });
    } finally {
      session.mutations.delete("friend");
      if (!session.controller.signal.aborted) dispatch({ type: "friend/pending", id: null });
    }
  };

  return {
    images,
    chatPeople: current ? { friends: state.friends, conversations: state.conversations } : { friends: [], conversations: [] },
    listStatuses: current ? state.lists : { friends: "loading", conversations: "loading" },
    activeChat, thread, isSending: thread.items.some((item) => item.status === "pending"), isDeleting: state.deletingKey === activeKey && activeKey !== null, removingFriendId: current ? state.removingFriendId : null,
    selectChat: (chat) => dispatch({ type: "select", chat }),
    selectFriend: (friend) => dispatch({ type: "select", chat: friendChat(friend, state.conversations) }),
    reloadList: (list) => { if (sessionRef.current && current && !sessionRef.current.controller.signal.aborted) loadList(list, sessionRef.current, state.revision); },
    refreshMessages: () => loadMessages(activeChat), loadOlder: () => loadMessages(activeChat, true),
    sendMessage, retryMessage: (message) => sendMessage(message.text, message), deleteHistory, removeFriend,
  };
};

export default useMessaging;
