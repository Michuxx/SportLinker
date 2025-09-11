import "./offerCard.css";
import { CiCalendar } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { LuTrophy } from "react-icons/lu";
import { GoPeople } from "react-icons/go";

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
    easy: ["beginner", "Początkujący"],
    mid: ["intermediate", "Średnio-zaawansowany"],
    expert: ["expert", "Zaawansowany"],
    any: ["any", "Dowolny poziom"],
  };

  const levelStyle = levelStyles[level] || "";

  return (
    <div className="offer-card-wrapper">
      <div className="offer-card-headline-wrapper">
        <h3>{title}</h3>
        <div className="offer-card-blocks">
          <span className="sport">{sport}</span>
          <span className={levelStyle[0]}>
            <LuTrophy />
            {levelStyle[1]}
          </span>
        </div>
      </div>
      <p className="description">{description}</p>
      <div className="offer-card-info">
        <div>
          <CiCalendar color="#3b82f6" size="22px" />
          <p>{date}</p>
        </div>
        <div>
          <IoLocationOutline color="#3b82f6" size="22px" />
          <p>{location}</p>
        </div>
        <div>
          <GoPeople color="#3b82f6" size="22px" />
          <p>
            {currentPeople}/{maxPeople} uczestników
          </p>
        </div>
      </div>
      <p className="author">Autor: {author}</p>
    </div>
  );
};

export default OfferCard;
