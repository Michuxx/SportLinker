import useDateFormat from "../../../../../hooks/useDateFormat";
import Avatar from "../../../../component-items/avatar/Avatar";
import Button from "../../../../component-items/button/button";
import "./friendInvitation.css";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

const FriendInvitation = ({ invitation }) => {
  const formattedDate = useDateFormat(invitation.date);

  return (
    <div className="friend-invitation-wrapper">
      <div className="friend-invitation-info-wrapper">
        <Avatar size={3} image={invitation.img} />
        <div className="friend-invitation-info">
          <h3>{invitation.name}</h3>
          <p>Wysłano {formattedDate.date}</p>
        </div>
      </div>
      <div className="friend-invitation-btn">
        <Button style="classicGreenButton" Icon={<FaCheck size={24} />}>
          Akceptuj
        </Button>
        <Button style="classicRedButton" Icon={<MdClose size={24} />}>
          Odrzuć
        </Button>
      </div>
    </div>
  );
};

export default FriendInvitation;
