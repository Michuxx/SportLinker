import UserDetailedMeta from "../userHeader/userHeaderInfo/UserInfoMeta";
import "./userDetailed.css";
import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import { LuTrophy } from "react-icons/lu";
import UserDetailedDescription from "./userDetailedDescription";
import UserDetailedSport from "./UserDetailedSport";
import { SPORT_OFFERS } from "../../../../../assets/SPORT_OFFERS";
import UserDetailedCards from "./UserDetailedCards";
import UserOffers from "./userOffers/UserOffers";

const UserDetailed = ({
  sport,
  aboutMe,
  editData,
  onChange,
  createdOffers,
  joinedOffers,
  invitations,
}) => {
  const favouriteSportText = `Ulubiony sport: ${sport ? sport : "brak"}`;

  const aboutText = aboutMe
    ? aboutMe
    : `Brak opisu. Kliknij "Edytuj", aby dodać informacje o sobie`;

  return (
    <div className="user-detailed-wrapper">
      <UserDetailedCards
        aboutText={aboutText}
        editData={editData}
        onChange={onChange}
        createdOffers={createdOffers}
        joinedOffers={joinedOffers}
        invitations={invitations}
      />
      <UserOffers />
    </div>
  );
};

export default UserDetailed;
