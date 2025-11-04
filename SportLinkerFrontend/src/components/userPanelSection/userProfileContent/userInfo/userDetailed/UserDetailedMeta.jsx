import EditInput from "../../../../component-items/input/EditInput";
import "./userDetailed.css";

const UserDetailedMeta = ({
  icon,
  text,
  isEditing,
  editData,
  onChange,
  name,
  placeholder,
}) => {
  return (
    <div className="user-detailed-meta-wrapper">
      <span>{icon}</span>
      {isEditing ? (
        <EditInput
          value={editData}
          name={name}
          onChange={(e) => onChange(e)}
          size={1}
          type="text"
          width={100}
          placeholder={placeholder}
        />
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default UserDetailedMeta;
