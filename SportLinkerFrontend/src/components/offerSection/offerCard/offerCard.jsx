import "./offerCard.css";

const OfferCard = ({
  title,
  sport,
  level,
  description,
  date,
  location,
  currentPeople,
  maxPeople,
  author,
}) => {
  const levelStyles = {
    Początkujący: "beginner",
    "Średnio-zaawansowany": "intermediate",
    Zaawansowany: "expert",
    "Dowolny poziom": "any",
  };

  const levelStyle = levelStyles[level] || "";

  return (
    <div className="offer-card-wrapper">
      <div className="offer-card-headline-wrapper">
        <h3>{title}</h3>
        <div className="offer-card-blocks">
          <span className="sport">{sport}</span>
          <span className={levelStyle}>{level}</span>
        </div>
      </div>
      <p className="description">{description}</p>
      <div className="offer-card-info">
        <div>
          <img src="" alt="" />
          <p>{date}</p>
        </div>
        <div>
          <img src="" alt="" />
          <p>{location}</p>
        </div>
        <div>
          <img src="" alt="" />
          <p>
            {currentPeople}/{maxPeople} uczestników
          </p>
        </div>
      </div>
      <p>Autor: {author}</p>
    </div>
  );
};

export default OfferCard;
