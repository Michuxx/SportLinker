import { parseApiDate } from "./dateTime.js";

const time = (value) => value ? parseApiDate(value).getTime() : NaN;
export const persistedMessage = (message) => Number.isInteger(message?.id) && message.id > 0;
const position = (message) => ({
  id: message?.lastReadMessageId ?? message?.id,
  time: time(message?.lastReadMessageSendAt ?? message?.timestamp ?? message?.sendAt ?? message?.time),
});

export const compareMessagePositions = (first, second) => {
  const a = position(first);
  const b = position(second);
  return a.time - b.time || Number(a.id) - Number(b.id);
};

// Preserve datetime2's sub-millisecond precision when matching a participation period.
const periodStart = (value) => `${time(value)}:${((typeof value === "string" && value.match(/\.(\d+)/)?.[1]) || "").padEnd(7, "0").slice(3)}`;

export const normalizeReadState = (data, knownStates = []) => {
  if (!Number.isInteger(data?.conversationId) || data.conversationId <= 0 ||
      !Number.isInteger(data?.userId) || data.userId <= 0 ||
      !Number.isFinite(time(data.joinedAt)) ||
      (data.leftAt != null && !Number.isFinite(time(data.leftAt))) ||
      (data.lastReadMessageId != null && (!Number.isInteger(data.lastReadMessageId) ||
        data.lastReadMessageId <= 0 || !Number.isFinite(time(data.lastReadMessageSendAt))))) return null;
  let participantId = data.participantId;
  if (participantId == null || participantId === 0) {
    // Older builds omit this DTO mapping. Reuse a real ID from the snapshot;
    // never infer it from UserId or invent a placeholder.
    const matches = knownStates.filter((read) => Number.isInteger(read.participantId) && read.participantId > 0 &&
      read.conversationId === data.conversationId && read.userId === data.userId &&
      periodStart(read.joinedAt) === periodStart(data.joinedAt));
    if (matches.length !== 1) return null;
    participantId = matches[0].participantId;
  }
  if (!Number.isInteger(participantId) || participantId <= 0) return null;
  return { ...data, participantId };
};

export const mergeReadStates = (current = [], incoming = []) => {
  const result = [...current];
  for (const value of incoming) {
    const read = normalizeReadState(value, result);
    if (!read) continue;
    const index = result.findIndex((item) => item.participantId === read.participantId);
    if (index < 0) result.push(read);
    else {
      const previous = result[index];
      const advances = read.lastReadMessageId != null && Number.isFinite(position(read).time) &&
        (previous.lastReadMessageId == null || compareMessagePositions(read, previous) > 0);
      result[index] = {
        ...previous,
        ...(advances ? read : {}),
        // A late snapshot must not reopen a finished participation period.
        leftAt: read.leftAt ?? previous.leftAt,
      };
    }
  }
  return result;
};

export const isMessageInReadPeriod = (read, message) => {
  const sentAt = position(message).time;
  return persistedMessage(message) && Number.isFinite(sentAt) &&
    sentAt >= time(read.joinedAt) &&
    (read.leftAt == null || sentAt < time(read.leftAt));
};

export const hasReadMessage = (read, message) => isMessageInReadPeriod(read, message) &&
  read.lastReadMessageId != null && Number.isFinite(position(read).time) &&
  compareMessagePositions(message, read) <= 0;

export const isMessageReadBy = (reads, userId, message) =>
  reads.some((read) => String(read.userId) === String(userId) && hasReadMessage(read, message));

export const getMessageReaders = (message, reads, userId) => {
  const readers = new Map();
  for (const read of reads) {
    if (String(read.userId) !== String(userId) &&
        String(read.userId) !== String(message.senderId) && hasReadMessage(read, message)) {
      readers.set(String(read.userId), read);
    }
  }
  return [...readers.values()];
};

export const getReadReceiptPositions = (messages, reads, userId) => {
  const latestByReader = new Map();
  for (const message of messages) {
    for (const reader of getMessageReaders(message, reads, userId)) {
      const key = String(reader.userId);
      const previous = latestByReader.get(key);
      if (!previous || compareMessagePositions(message, previous.message) > 0) {
        latestByReader.set(key, { message, reader });
      }
    }
  }
  const positions = new Map();
  for (const { message, reader } of latestByReader.values()) {
    const readers = positions.get(message.id) ?? [];
    readers.push(reader);
    positions.set(message.id, readers);
  }
  return positions;
};

export const unreadAfterReads = (chat, messages, previous, next, userId) => {
  const ownReads = next.filter((read) => String(read.userId) === String(userId));
  if (!ownReads.length) return chat.unreadCount ?? 0;
  const newlyRead = messages.filter((message) =>
    !message.isOwnMessage && String(message.senderId) !== String(userId) &&
    !isMessageReadBy(previous, userId, message) && isMessageReadBy(next, userId, message));
  const remaining = Math.max(0, (chat.unreadCount ?? 0) - newlyRead.length);
  // A cursor in a later participation period cannot clear unread history from an earlier one.
  const latest = chat.lastMessage;
  if (ownReads.length === 1 && latest && isMessageReadBy(next, userId, {
    id: latest.id, timestamp: latest.time,
  })) return 0;
  return remaining;
};
