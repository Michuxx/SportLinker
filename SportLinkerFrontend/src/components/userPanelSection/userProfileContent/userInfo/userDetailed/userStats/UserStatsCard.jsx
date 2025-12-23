import "./userStats.css";

const UserStatsCard = ({ value, text }) => {
  return (
    <div className="user-card-stats-wrapper">
      <p>{text}</p>
      <span>{value}</span>
    </div>
  );
};

export default UserStatsCard;
