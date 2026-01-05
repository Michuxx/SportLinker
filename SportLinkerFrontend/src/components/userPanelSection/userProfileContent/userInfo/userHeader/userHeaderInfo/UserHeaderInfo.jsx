import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import UserInfoMeta from "./UserInfoMeta";
import "./userHeaderInfo.css";

const UserHeaderInfo = ({ creationDate, location }) => {
  const dateCreationText = `Dołączył: ${creationDate}`;

  const localizationText = location ? location : "Nie podano lokalizacji";

  return (
    <div className="user-header-meta-wrapper">
      <UserInfoMeta
        icon={<FiCalendar size={24} color="rgb(59 130 246)" />}
        text={dateCreationText}
      />
      <UserInfoMeta
        icon={<GrLocation size={24} color="rgb(59 130 246)" />}
        text={localizationText}
      />
    </div>
  );
};

export default UserHeaderInfo;
