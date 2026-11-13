import { parseApiDate } from "./dateTime.js";

export const chatKey = (chat) =>
  chat.id ? `conversation:${chat.id}` : `friend:${chat.recipientUserId}`;

export const canDeleteConversation = (chat, friends, friendsStatus) => {
  if (!chat?.id) return false;
  if (chat.type === "group") return chat.canSendMessages === false;
  if (chat.type !== "private" || friendsStatus !== "ready") return false;
  if (chat.recipientUserId == null) return chat.canSendMessages === false;
  return !friends.some(
    (friend) => String(friend.userId) === String(chat.recipientUserId),
  );
};

export const normalizeFriend = (data) => ({
  ...data,
  id: data.friendshipId ?? data.id,
  imageUrl: data.imageUrl ?? data.img,
});

export const normalizeConversation = (data) => ({
  ...data,
  type:
    typeof data.type === "number"
      ? ["private", "group"][data.type]
      : data.type?.toLowerCase(),
  canSendMessages: data.canSendMessages ?? true,
  lastMessage:
    data.lastMessage ??
    (data.lastMessageText != null
      ? {
          id: data.lastMessageId,
          name: data.lastMessageSenderName,
          text: data.lastMessageText,
          time: data.lastMessageTime,
        }
      : null),
});

export const normalizeMessage = (data) => ({
  ...data,
  senderImageUrl: data.senderImageUrl ?? data.imageUrl,
  text: data.content ?? data.text,
  timestamp: data.sendAt ?? data.timestamp,
  status: data.status ?? "sent",
});

export const normalizeMessagesPage = (data) => {
  const items = Array.isArray(data) ? data : data.items;
  if (!Array.isArray(items)) throw new Error("Nieprawidłowa lista wiadomości.");
  return {
    items: items.map(normalizeMessage),
    hasMore: Boolean(data.hasMore),
    cursor: data.nextCursor ?? null,
  };
};

const timestamp = (value) => (value ? parseApiDate(value).getTime() || 0 : 0);

const isPersistedMessage = (message) =>
  Number.isInteger(Number(message.id)) && Number(message.id) > 0;

export const sameMessage = (first, second) => {
  if (
    first.id != null &&
    second.id != null &&
    String(first.id) === String(second.id)
  ) {
    return true;
  }

  return Boolean(
    first.clientMessageId &&
    second.clientMessageId &&
    first.senderId != null &&
    second.senderId != null &&
    String(first.senderId) === String(second.senderId) &&
    first.clientMessageId.toLowerCase() ===
      second.clientMessageId.toLowerCase(),
  );
};

export const mergeMessages = (current, incoming) => {
  const result = [...current];

  for (const message of incoming) {
    const index = result.findIndex((item) => sameMessage(item, message));

    if (index < 0) {
      result.push(message);
      continue;
    }

    const existing = result[index];

    // Potwierdzona wiadomość serwerowa ma pierwszeństwo
    // przed późniejszą aktualizacją lokalnej wiadomości.
    result[index] =
      isPersistedMessage(existing) && !isPersistedMessage(message)
        ? { ...message, ...existing }
        : { ...existing, ...message };
  }

  return result.sort(
    (a, b) =>
      timestamp(a.timestamp) - timestamp(b.timestamp) ||
      (Number(a.id) || 0) - (Number(b.id) || 0),
  );
};

export const withConversationPreview = (conversations, chat, message) => {
  const existing = conversations.find((item) => item.id === chat.id);
  const previous = existing?.lastMessage ?? chat.lastMessage;

  const previousMessage = previous
    ? {
        id: previous.id,
        clientMessageId: previous.clientMessageId,
        senderId: previous.senderId,
        senderName: previous.name,
        text: previous.text,
        timestamp: previous.time,
      }
    : null;

  const latest = mergeMessages(previousMessage ? [previousMessage] : [], [
    message,
  ]).at(-1);

  const updated = {
    ...existing,
    ...chat,
    lastMessage: {
      id: latest.id,
      clientMessageId: latest.clientMessageId,
      senderId: latest.senderId,
      name: latest.senderName,
      text: latest.text,
      time: latest.timestamp,
    },
  };

  return [updated, ...conversations.filter((item) => item.id !== chat.id)].sort(
    (a, b) =>
      timestamp(b.lastMessage?.time) - timestamp(a.lastMessage?.time) ||
      (Number(b.lastMessage?.id) || 0) - (Number(a.lastMessage?.id) || 0) ||
      Number(b.id) - Number(a.id),
  );
};

export const friendChat = (friend, conversations) => {
  const existing = conversations.find(
    (item) =>
      item.id === friend.conversationId ||
      (item.type === "private" &&
        (item.recipientUserId === friend.userId ||
          item.participants?.some(
            (participant) => participant.id === friend.userId,
          ))),
  );
  return (
    existing ?? {
      id: friend.conversationId ?? null,
      recipientUserId: friend.userId,
      name: friend.name,
      type: "private",
      imageUrl: friend.imageUrl,
      isOnline: friend.isOnline,
      lastTimeOnline: friend.lastTimeOnline,
      canSendMessages: true,
    }
  );
};
