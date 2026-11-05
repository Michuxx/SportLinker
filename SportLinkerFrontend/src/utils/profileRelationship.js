const relationships = ["anonymous", "self", "none", "friends", "requestsent", "requestreceived"];

export const normalizeProfileRelationship = (value) => {
  const relationship = typeof value === "number" ? relationships[value] : String(value).toLowerCase();
  return relationships.includes(relationship) ? relationship : "anonymous";
};

export const prepareFriendAction = (action, profile) => {
  const relationship = normalizeProfileRelationship(profile.relationship);
  if (action === "send" && relationship === "none") {
    const receiverId = Number(profile.userId);
    if (Number.isInteger(receiverId) && receiverId > 0) return { receiverId };
  }
  if (["accept", "reject"].includes(action) && relationship === "requestreceived") {
    const friendRequestId = Number(profile.friendRequestId);
    if (Number.isInteger(friendRequestId) && friendRequestId > 0) return { friendRequestId };
  }
  return null;
};

export const applyFriendAction = (profile, action) => ({
  ...profile,
  relationship: action === "send" ? "requestsent" : action === "accept" ? "friends" : "none",
  friendRequestId: null,
});
