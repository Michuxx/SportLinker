export const applyOfferJoin = (offer, user, joinDate) => {
  if (offer.mode === "private") {
    return { ...offer, status: "pending" };
  }

  const alreadyJoined = offer.members.some(
    (member) => String(member.id) === String(user.id),
  );
  const members = alreadyJoined ? offer.members : [
      ...offer.members,
      {
        id: user.id,
        userId: user.id,
        name: user.name || user.userName || "Ty",
        image: user.profileImage || user.image || null,
        joinDate,
      },
    ];
  return {
    ...offer,
    status: "accepted",
    members,
    availability: members.length >= offer.maxPeople ? "Unavailable" : offer.availability,
  };
};
