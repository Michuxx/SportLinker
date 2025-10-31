import { useState } from "react";
import UserDetailedMeta from "./UserDetailedMeta";
import "./userDetailed.css";
import { GrLocation } from "react-icons/gr";
import { CiCalendar } from "react-icons/ci";
import { LuTrophy } from "react-icons/lu";
import UserDetailedDescription from "./userDetailedDescription";

const UserDetailed = ({
  creationDate,
  location,
  sport,
  aboutMe,
  editData,
  isEditing,
}) => {
  const [parsedUserData, setParsedUserData] = useState({
    dateCreation: creationDate,
    localization: location ? location : "Nie podano lokalizacji",
    favouriteSport: sport ? sport : "brak",
    about: aboutMe
      ? aboutMe
      : `Brak opisu. Kliknij "Edytuj", aby dodać informacje o sobie`,
  });

  return (
    <div className="user-detailed-wrapper">
      <div className="user-detailed-section">
        <h3>Informacje podstawowe</h3>
        <UserDetailedMeta
          icon={<CiCalendar size={24} color="rgb(59 130 246)" />}
          text={`Dołączył: ${parsedUserData.dateCreation}`}
        />
        <UserDetailedMeta
          icon={<GrLocation size={24} color="rgb(59 130 246)" />}
          text={parsedUserData.localization}
        />
        <UserDetailedMeta
          icon={<LuTrophy size={24} color="rgb(59 130 246)" />}
          text={`Ulubiony sport: ${parsedUserData.favouriteSport}`}
        />
      </div>
      <div className="user-detailed-section">
        <h3>O mnie</h3>
        <UserDetailedDescription text={parsedUserData.about} />
      </div>
    </div>
  );
};

export default UserDetailed;
