import "./editInput.css";

const EditInput = ({
  placeholder,
  type,
  width,
  conditionalClass,
  onChange,
  value,
  name,
  min,
  max,
  size,
  icon,
}) => {
  return (
    <div className="edit-input-wrapper">
      {icon && <span>{icon}</span>}
      <input
        className={`edit-input ` + (conditionalClass && `edit-input-error`)}
        type={type}
        placeholder={placeholder}
        style={{ width: `${width}%`, fontSize: `${size}rem` }}
        onChange={onChange}
        value={value}
        name={name}
        min={min}
        max={max}
      />
    </div>
  );
};

export default EditInput;
