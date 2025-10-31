import "./userStats.css";

const UserStatsCard = ({ value, text }) => {
  return (
    <div className="user-card-wrapper">
      <span>{value}</span>
      <p>{text}</p>
    </div>
  );
};

export default UserStatsCard;
