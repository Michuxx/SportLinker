import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import UserInfoMeta from "./UserInfoMeta";

const UserHeaderInfo = ({
  creationDate,
  location,
  editData,
  isEditing,
  onChange,
}) => {
  const dateCreationText = `Dołączył: ${creationDate}`;

  const localizationText = location ? location : "Nie podano lokalizacji";

  return (
    <div className="user-detailed-wrapper">
      <UserInfoMeta
        icon={<FiCalendar size={24} color="rgb(59 130 246)" />}
        text={dateCreationText}
      />
      <UserInfoMeta
        icon={<GrLocation size={24} color="rgb(59 130 246)" />}
        text={localizationText}
        isEditing={isEditing}
        editData={editData.location}
        name="location"
        onChange={onChange}
        placeholder="Nie podawaj dokładnej lokalizacji"
      />
    </div>
  );
};

export default UserHeaderInfo;
