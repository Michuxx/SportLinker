import EditInput from "../../../../../component-items/input/EditInput";
import "./userHeaderInfo.css";

const UserInfoMeta = ({ icon, text }) => {
  return (
    <div className="user-meta-wrapper">
      <span>{icon}</span>
      <p>{text}</p>
    </div>
  );
};

export default UserInfoMeta;
