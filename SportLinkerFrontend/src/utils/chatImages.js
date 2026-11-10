const validId = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

export const collectChatImages = ({ user, friends, conversations, messages, activeChat }) => {
  const ids = new Set();
  const known = {};
  const add = (id, image) => {
    if (!validId(id)) return;
    const key = String(id);
    ids.add(key);
    if (typeof image === "string" && image.trim()) known[key] = image;
  };
  friends.forEach((friend) => add(friend.userId, friend.imageUrl));
  conversations.filter((chat) => chat.type === "private").forEach((chat) => add(chat.recipientUserId, chat.imageUrl));
  if (activeChat?.type === "private") add(activeChat.recipientUserId, activeChat.imageUrl);
  messages.forEach((message) => add(message.senderId, message.senderImageUrl));
  add(user?.id, user?.profileImage ?? user?.imageUrl);
  return { ids: [...ids].sort(), known };
};
