import "./offerMatchCards.css";

const MatchCard = ({ title, text, icon }) => {
  return (
    <div className="offer-match-card-container">
      <div className="match-icon">{icon}</div>
      <div className="offer-match-card-info">
        <p className="match-card-title">{title}</p>
        <p className="match-card-text">{text}</p>
      </div>
    </div>
  );
};

export default MatchCard;
