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
  if (action === "cancel" && relationship === "requestsent") {
    const requestId = Number(profile.friendRequestId);
    if (Number.isInteger(requestId) && requestId > 0) return { requestId };
  }
  if (action === "delete" && relationship === "friends") {
    const friendId = Number(profile.userId);
    if (Number.isInteger(friendId) && friendId > 0) return { friendId };
  }
  return null;
};

const actionRelationships = { send: "requestsent", accept: "friends", reject: "none", cancel: "none", delete: "none" };

export const applyFriendAction = (profile, action, result) => actionRelationships[action] ? ({
  ...profile,
  relationship: actionRelationships[action],
  friendRequestId: action === "send" && Number.isInteger(result) && result > 0 ? result : null,
}) : profile;
