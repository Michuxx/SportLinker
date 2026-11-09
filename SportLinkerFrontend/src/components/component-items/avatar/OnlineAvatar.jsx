import OnlineDot from "./OnlineDot";
import Avatar from "./Avatar";
import "./avatar.css";

const OnlineAvatar = ({ isOnline, size, image }) => {
  return (
    <div className="online-avatar-wrapper">
      <Avatar size={size} image={image} />
      {isOnline && <OnlineDot size={size} />}
    </div>
  );
};

export default OnlineAvatar;
