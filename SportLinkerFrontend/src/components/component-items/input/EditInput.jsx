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
  size
}) => {
  return (
    <input
      className={`edit-input ` + (conditionalClass && `edit-input-error`)}
      type={type}
      placeholder={placeholder}
      style={{ width: `${width}%`, fontSize: `${size}rem`}}
      onChange={onChange}
      value={value}
      name={name}
      min={min}
      max={max}
    />
  );
};

export default EditInput;
