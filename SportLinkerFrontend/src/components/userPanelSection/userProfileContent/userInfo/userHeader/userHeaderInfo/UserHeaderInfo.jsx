import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import UserInfoMeta from "./UserInfoMeta";
import "./userHeaderInfo.css";
import useAgeCalculate from "../../../../../../hooks/useAgeCalculate";
import { TbGenderMale } from "react-icons/tb";

const UserHeaderInfo = ({ birthDate, location, gender }) => {
  const age = useAgeCalculate(birthDate);

  const birthDateText = age ? `${age} lat` : "Nie podano wieku";

  const localizationText = location
    ? location.displayLabel
    : "Nie podano lokalizacji";

  const genderText = gender ? gender.text : "Nie podano";

  return (
    <div className="user-header-meta-wrapper">
      <UserInfoMeta
        icon={<FiCalendar size={24} color="rgb(59 130 246)" />}
        text={birthDateText}
      />
      <UserInfoMeta
        icon={<GrLocation size={24} color="rgb(59 130 246)" />}
        text={localizationText}
      />
      <UserInfoMeta
        icon={<TbGenderMale size={24} color="rgb(59 130 246)" />}
        text={genderText}
      />
    </div>
  );
};

export default UserHeaderInfo;
