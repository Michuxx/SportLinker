import useDateFormat from "../../../../../hooks/useDateFormat";
import Avatar from "../../../../component-items/avatar/Avatar";
import Button from "../../../../component-items/button/button";
import "./friendInvitation.css";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { Link } from "react-router";

const FriendInvitation = ({ invitation, onAccept, onReject, isBusy = false, isPending = false }) => {
  const formattedDate = useDateFormat(invitation.createdAt);

  return (
    <div className="friend-invitation-wrapper" aria-busy={isPending}>
      <div className="friend-invitation-info-wrapper">
        <Link to={`/profile/userInfo/${invitation.senderId}`} aria-label={`Profil użytkownika ${invitation.senderUsername}`}>
          <Avatar size={3} image={invitation.imageUrl} />
        </Link>
        <div className="friend-invitation-info">
          <h3><Link className="friend-invitation-profile-link" to={`/profile/userInfo/${invitation.senderId}`}>{invitation.senderUsername}</Link></h3>
          <p>Wysłał zaproszenie {formattedDate.date}</p>
        </div>
      </div>
      <div className="friend-invitation-btn">
        {isPending && <span role="status">Zapisywanie...</span>}
        <Button style="classicGreenButton" Icon={<FaCheck size={24} />} onClick={onAccept} disabled={isBusy}>
          Akceptuj
        </Button>
        <Button
          style="classicRedButton"
          Icon={<MdClose size={24} />}
          onClick={onReject}
          disabled={isBusy}
        >
          Odrzuć
        </Button>
      </div>
    </div>
  );
};

export default FriendInvitation;
