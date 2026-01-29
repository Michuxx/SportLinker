import "./reportTag.css";
import { RiCloseCircleLine } from "react-icons/ri";
import { MdOutlineAccessTime } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";

const ReportTag = ({ styleType }) => {
  const styleMap = {
    pending: [
      "report-pending-tag",
      "Oczekuje",
      <MdOutlineAccessTime size={18} />,
    ], //class, text, icon
    rejected: [
      "report-rejected-tag",
      "Odrzucone",
      <RiCloseCircleLine size={18} />,
    ],
    solved: ["report-solved-tag", "Rozwiązane", <MdTaskAlt size={18} />],
  };

  const tagMap = styleMap[styleType] || "";

  return (
    <div className={`reportTag ${tagMap[0]}`}>
      {tagMap[2]}
      {tagMap[1]}
    </div>
  );
};

export default ReportTag;
