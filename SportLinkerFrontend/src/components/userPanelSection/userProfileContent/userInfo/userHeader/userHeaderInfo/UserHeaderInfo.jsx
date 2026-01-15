import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import UserInfoMeta from "./UserInfoMeta";
import "./userHeaderInfo.css";
import useAgeCalculate from "../../../../../../hooks/useAgeCalculate";

const UserHeaderInfo = ({ birthDate, location }) => {
  const age = useAgeCalculate(birthDate);

  const birthDateText = age ? `${age} lat` : "Nie podano wieku";

  const localizationText = location ? location : "Nie podano lokalizacji";

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
    </div>
  );
};

export default UserHeaderInfo;
