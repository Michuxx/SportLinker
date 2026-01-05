import "./userStats.css";

const UserStatsCard = ({ value, text, bgColor, textColor }) => {
  return (
    <div
      className="user-card-stats-wrapper"
      style={{ backgroundColor: bgColor }}
    >
      <p>{text}</p>
      <span style={{ color: textColor }}>{value}</span>
    </div>
  );
};

export default UserStatsCard;
