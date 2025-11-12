import "./tag.css";

const Tag = ({ styleType, text, icon }) => {
  const styleMap = {
    easy: ["beginner", "Początkujący"],
    mid: ["intermediate", "Średnio-zaawansowany"],
    expert: ["expert", "Zaawansowany"],
    any: ["any", "Dowolny poziom"],
    sport: ["sport", `${text}`],
    open: ["open", "Dostępne"],
    closed: ["closed", "Zamknięte"],
    pending: ["pending", "Oczekuje na zaakceptowanie"],
  };

  const map = styleMap[styleType] || "";

  return (
    <div className={`tag ${map[0]}`}>
      {icon}
      {map[1]}
    </div>
  );
};

export default Tag;
