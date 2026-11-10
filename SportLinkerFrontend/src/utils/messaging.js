import { parseApiDate } from "./dateTime.js";

export const chatKey = (chat) => chat.id ? `conversation:${chat.id}` : `friend:${chat.recipientUserId}`;

export const normalizeFriend = (data) => ({
  ...data,
  id: data.friendshipId ?? data.id,
  imageUrl: data.imageUrl ?? data.img,
});

export const normalizeConversation = (data) => ({
  ...data,
  type: typeof data.type === "number" ? ["private", "group"][data.type] : data.type?.toLowerCase(),
  canSendMessages: data.canSendMessages ?? true,
  lastMessage: data.lastMessage ?? (data.lastMessageText != null ? {
    id: data.lastMessageId,
    name: data.lastMessageSenderName,
    text: data.lastMessageText,
    time: data.lastMessageTime,
  } : null),
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
  return { items: items.map(normalizeMessage), hasMore: Boolean(data.hasMore), cursor: data.nextCursor ?? null };
};

const timestamp = (value) => value ? parseApiDate(value).getTime() || 0 : 0;

// A server echo replaces the local bubble with the same UUID; it never adds a duplicate.
export const mergeMessages = (current, incoming) => {
  const result = [...current];
  for (const message of incoming) {
    const index = result.findIndex((item) =>
      (message.clientMessageId && item.clientMessageId === message.clientMessageId)
      || String(item.id) === String(message.id));
    if (index < 0) result.push(message);
    else result[index] = { ...result[index], ...message };
  }
  return result.sort((a, b) => timestamp(a.timestamp) - timestamp(b.timestamp) || (Number(a.id) || 0) - (Number(b.id) || 0));
};

export const withConversationPreview = (conversations, chat, message) => {
  const existing = conversations.find((item) => item.id === chat.id);
  const updated = { ...existing, ...chat, lastMessage: { name: message.senderName, text: message.text, time: message.timestamp } };
  return [updated, ...conversations.filter((item) => item.id !== chat.id)];
};

export const friendChat = (friend, conversations) => {
  const existing = conversations.find((item) => item.id === friend.conversationId
    || (item.type === "private" && (item.recipientUserId === friend.userId
      || item.participants?.some((participant) => participant.id === friend.userId))));
  return existing ?? { id: friend.conversationId ?? null, recipientUserId: friend.userId, name: friend.name, type: "private", imageUrl: friend.imageUrl, isOnline: friend.isOnline, lastTimeOnline: friend.lastTimeOnline, canSendMessages: true };
};
