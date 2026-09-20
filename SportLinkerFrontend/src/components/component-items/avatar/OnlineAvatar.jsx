import OnlineDot from "./OnlineDot";
import Avatar from "./Avatar";
import "./avatar.css";

const OnlineAvatar = ({ isOnline, size }) => {
  return (
    <div className="online-avatar-wrapper">
      <Avatar size={size} />
      {isOnline && <OnlineDot size={size} />}
    </div>
  );
};

export default OnlineAvatar;
