import "./userDetailed.css";
import Textarea from "../../../../component-items/textarea/Textarea";

const UserDetailedDescription = ({
  text,
  isEditing,
  editData,
  name,
  onChange,
  placeholder,
}) => {
  return (
    <div className="user-detailed-description-wrapper">
      {isEditing ? (
        <Textarea
          placeholder={placeholder}
          name={name}
          onChange={(e) => onChange(e)}
          value={editData.aboutMe}
          width={100}
        />
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default UserDetailedDescription;
