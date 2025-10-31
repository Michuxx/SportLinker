import "./userDetailed.css";

const UserDetailedMeta = ({ icon, text }) => {
  return (
    <div className="user-detailed-meta-wrapper">
      {icon}
      <p>{text}</p>
    </div>
  );
};

export default UserDetailedMeta;
