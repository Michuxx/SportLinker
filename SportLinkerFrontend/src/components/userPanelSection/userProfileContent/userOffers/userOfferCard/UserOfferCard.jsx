import OfferCardAuthor from "../../../../offerSection/offerCard/OfferCardAuthor";
import OfferCardBlock from "../../../../offerSection/offerCard/OfferCardBlock";
import OfferCardDate from "../../../../offerSection/offerCard/OfferCardDate";
import OfferCardDescription from "../../../../offerSection/offerCard/OfferCardDescription";
import OfferCardLocation from "../../../../offerSection/offerCard/OfferCardLocation";
import OfferCardPeople from "../../../../offerSection/offerCard/OfferCardPeople";
import "./userOfferCard.css";
import { LuTrophy } from "react-icons/lu";

const UserOfferCard = ({
  title,
  sport,
  level,
  description,
  date,
  location,
  currentPeople,
  maxPeople,
  availability,
}) => {
  const levelMap = {
    easy: ["beginner", "Początkujący"],
    mid: ["intermediate", "Średnio-zaawansowany"],
    expert: ["expert", "Zaawansowany"],
    any: ["any", "Dowolny poziom"],
  };

  const levelArr = levelMap[level] || "";

  const availabilityMap = {
    open: ["open", "Dostępne"],
    closed: ["closed", "Zamknięte"],
  };

  const availabilityArr = availabilityMap[availability] || "";

  return (
    <div className="user-offer-card-wrapper">
      <div className="user-offer-card-tag-wrapper">
        <OfferCardBlock
          levelStyle={levelArr[0]}
          sport={sport}
          levelText={levelArr[1]}
          icon={<LuTrophy />}
          availabilityClass={availabilityArr[0]}
          availabilityText={availabilityArr[1]}
        />
      </div>
      <h3>{title}</h3>
      <OfferCardDescription text={description} />
      <div className="user-offer-card-info-wrapper">
        <OfferCardDate date={date} />
        <OfferCardLocation location={location} />
        <OfferCardPeople currentPeople={currentPeople} maxPeople={maxPeople} />
      </div>
    </div>
  );
};

export default UserOfferCard;
