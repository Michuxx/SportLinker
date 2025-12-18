import UserDetailedMeta from "../userHeader/userHeaderInfo/UserInfoMeta";
import "./userDetailed.css";
import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import { LuTrophy } from "react-icons/lu";
import UserDetailedDescription from "./userDetailedDescription";
import UserDetailedSport from "./UserDetailedSport";
import { SPORT_OFFERS } from "../../../../../assets/SPORT_OFFERS";

const UserDetailed = ({
  creationDate,
  location,
  sport,
  aboutMe,
  editData,
  isEditing,
  onChange,
}) => {
  const dateCreationText = `Dołączył: ${creationDate}`;

  const localizationText = location ? location : "Nie podano lokalizacji";

  const favouriteSportText = `Ulubiony sport: ${sport ? sport : "brak"}`;

  const aboutText = aboutMe
    ? aboutMe
    : `Brak opisu. Kliknij "Edytuj", aby dodać informacje o sobie`;

  return (
    <div className="user-detailed-wrapper">
      <div className="user-detailed-section">
        <h3>Informacje podstawowe</h3>
        {/* <UserDetailedMeta
          icon={<FiCalendar size={24} color="rgb(59 130 246)" />}
          text={dateCreationText}
        />
        <UserDetailedMeta
          icon={<GrLocation size={24} color="rgb(59 130 246)" />}
          text={localizationText}
          isEditing={isEditing}
          editData={editData.location}
          name="location"
          onChange={onChange}
          placeholder="Nie podawaj dokładnej lokalizacji"
        /> */}
        <UserDetailedSport
          icon={<LuTrophy size={24} color="rgb(59 130 246)" />}
          text={favouriteSportText}
          isEditing={isEditing}
          name="favouriteSport"
          onChange={onChange}
          defaultValue="none"
          defaultText="Brak"
          options={SPORT_OFFERS}
          prevValue={editData.favouriteSport}
        />
      </div>
      <div className="user-detailed-section">
        <h3>O mnie</h3>
        <UserDetailedDescription
          text={aboutText}
          isEditing={isEditing}
          editData={editData}
          name="aboutMe"
          onChange={onChange}
          placeholder="Napisz coś o sobie :)"
        />
      </div>
    </div>
  );
};

export default UserDetailed;
