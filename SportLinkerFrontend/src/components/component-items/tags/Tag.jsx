import "./tag.css";

const Tag = ({ styleType, text, icon }) => {
  const styleMap = {
    easy: "beginner",
    mid: "intermediate",
    expert: "expert",
    any: "any",
    sport: "sport",
    open: "open",
    closed: "closed",
    pending: "pending",
  };

  const style = styleMap[styleType] || "";

  return (
    <div className={`tag ${style}`}>
      {icon}
      {text}
    </div>
  );
};

export default Tag;
