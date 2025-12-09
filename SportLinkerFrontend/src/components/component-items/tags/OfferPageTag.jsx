import "./offerPageTag.css";
import { LuTrophy } from "react-icons/lu";
import { FiLock } from "react-icons/fi";
import { FiUnlock } from "react-icons/fi";

const Tag = ({ styleType, text }) => {
  const styleMap = {
    easy: ["offer-beginner", "Początkujący", <LuTrophy />], //class, text, icon
    mid: ["offer-intermediate", "Średnio-zaawansowany", <LuTrophy />],
    expert: ["offer-expert", "Zaawansowany", <LuTrophy />],
    any: ["offer-any", "Dowolny poziom", <LuTrophy />],
    sport: ["offer-sport", `${text}`],
    private: ["offer-private", "Tryb: Prywatny", <FiLock />],
    public: ["offer-public", "Tryb: Publiczny", <FiUnlock />],
  };

  const tagMap = styleMap[styleType] || "";

  return (
    <div className={`offerTag ${tagMap[0]}`}>
      {tagMap[2]}
      {tagMap[1]}
    </div>
  );
};

export default Tag;
