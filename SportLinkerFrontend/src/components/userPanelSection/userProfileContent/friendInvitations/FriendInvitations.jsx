import useAuth from "../../../../hooks/useAuth";
import useFriendInvitations from "../../../../hooks/useFriendInvitations";
import FriendInvitation from "./friendInvitation/FriendInvitation";
import "./friendInvitations.css";
import NullFriends from "./nullFriends/NullFriends";
import FriendInvitationsFeedback from "./friendInvitationsFeedback/FriendInvitationsFeedback";

const FriendInvitations = () => {
  const { user } = useAuth();
  const { invitations, isLoading, error, pendingId, resolveInvitation, reload } = useFriendInvitations(user?.id);

  return (
    <div className="friend-invitations-wrapper">
      {!user?.id ? <FriendInvitationsFeedback type="login" />
        : isLoading ? <FriendInvitationsFeedback type="loading" />
        : error ? <FriendInvitationsFeedback type="error" onRetry={reload} />
        : invitations.length === 0 ? (
        <NullFriends />
      ) : (
        invitations.map((invitation) => (
          <FriendInvitation
            invitation={invitation}
            key={invitation.friendRequestId}
            isBusy={pendingId !== null}
            isPending={pendingId === invitation.friendRequestId}
            onAccept={() => resolveInvitation(invitation.friendRequestId, "accept")}
            onReject={() => resolveInvitation(invitation.friendRequestId, "reject")}
          />
        ))
      )}
    </div>
  );
};

export default FriendInvitations;
