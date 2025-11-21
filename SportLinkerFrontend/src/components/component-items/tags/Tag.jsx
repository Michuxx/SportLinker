import "./tag.css";
import { LuTrophy } from "react-icons/lu";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsPersonDown } from "react-icons/bs";

const Tag = ({ styleType, text }) => {
  const styleMap = {
    easy: ["beginner", "Początkujący", <LuTrophy />], //class, text, icon
    mid: ["intermediate", "Średnio-zaawansowany", <LuTrophy />],
    expert: ["expert", "Zaawansowany", <LuTrophy />],
    any: ["any", "Dowolny poziom", <LuTrophy />],
    sport: ["sport", `${text}`],
    open: ["open", "Dostępne"],
    closed: ["closed", "Zamknięte"],
    pending: ["pending", "Oczekuje na zaakceptowanie", <MdOutlineAccessTime />],
    accepted: ["accepted", "Zaakceptowano"],
    overpopulation: ["expert", "Limit osób wyczerpany", <BsPersonDown size={24}/>]
  };

  const tagMap = styleMap[styleType] || "";

  return (
    <div className={`tag ${tagMap[0]}`}>
      {tagMap[2]}
      {tagMap[1]}
    </div>
  );
};

export default Tag;
