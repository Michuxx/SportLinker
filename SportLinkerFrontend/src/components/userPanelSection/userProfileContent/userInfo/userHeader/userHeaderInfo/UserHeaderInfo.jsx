import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import UserInfoMeta from "./UserInfoMeta";
import "./userHeaderInfo.css";
import useAgeCalculate from "../../../../../../hooks/useAgeCalculate";
import { TbGenderMale, TbGenderFemale, TbGenderTransgender } from "react-icons/tb";
import { getGenderLabel } from "../../../../../../assets/GENDERS";

const UserHeaderInfo = ({ birthDate, location, gender }) => {
  const age = useAgeCalculate(birthDate);

  const birthDateText = age ? `${age} lat` : "Nie podano wieku";

  const formatLocation = (loc) => {
    if (!loc) return "Nie podano lokalizacji";
    const label = typeof loc === "string" ? loc : loc.displayLabel;
    if (!label || label.trim() === "," || label.trim() === ", ") {
      const parts = [loc.city || loc.name, loc.state].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "Nie podano lokalizacji";
    }
    return label;
  };

  const localizationText = formatLocation(location);

  const genderText = getGenderLabel(gender);

  const getGenderIcon = (g) => {
    const val = String(g || "").toLowerCase();
    if (val === "female") return <TbGenderFemale size={24} color="rgb(59 130 246)" />;
    if (val === "other") return <TbGenderTransgender size={24} color="rgb(59 130 246)" />;
    return <TbGenderMale size={24} color="rgb(59 130 246)" />;
  };

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
        icon={getGenderIcon(gender)}
        text={genderText}
      />
    </div>
  );
};

export default UserHeaderInfo;
