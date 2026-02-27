import useDifferenceDates from "../../../hooks/useDifferenceDates";
import OnlineAvatar from "../../component-items/avatar/OnlineAvatar";
import Button from "../../component-items/button/button";
import "./conversation.css";
import { HiDotsHorizontal } from "react-icons/hi";

const ConversationHeader = ({ chatUser }) => {
  const formattedDate = useDifferenceDates(chatUser.lastTimeOnline);

  const formattedDateText =
    formattedDate !== 0
      ? `Ostatnio aktywny ${formattedDate} dni temu`
      : `Ostatnio dzisiaj online`;

  return (
    <div className="conversation-header-wrapper">
      <div className="avatar-info-wrapper">
        <OnlineAvatar size={3} isOnline={chatUser.isOnline} />
        <div className="user-info-header-wrapper">
          <h3>{`${chatUser.type === "group" ? "Grupa: " : ""} ${
            chatUser.name
          }`}</h3>
          <span>{chatUser.isOnline ? "Online" : formattedDateText}</span>
        </div>
      </div>
      <div className="conversation-btn-wrapper">
        <Button
          style="popupSettingsButton"
          Icon={<HiDotsHorizontal size={25} />}
        />
      </div>
    </div>
  );
};

export default ConversationHeader;
