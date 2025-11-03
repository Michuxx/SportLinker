import Select from "../../../../component-items/select/Select";
import "./userDetailed.css";

const UserDetailedSport = ({
  icon,
  text,
  isEditing,
  onChange,
  name,
  defaultValue,
  defaultText,
  options,
  prevValue,
}) => {
  return (
    <div className="user-detailed-meta-wrapper">
      {icon}
      {isEditing ? (
        <Select
          onChange={(e) => onChange(e)}
          name={name}
          defaultText={defaultText}
          defaultValue={defaultValue}
          options={options}
          value={prevValue}
        />
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default UserDetailedSport;
