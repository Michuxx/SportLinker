import "./editInput.css";

const EditInput = ({
  placeholder,
  type,
  width,
  error,
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
      {icon && <div className="edit-input-icon">{icon}</div>}
      <div className="input-error-wrapper">
        <input
          className={`edit-input ` + (error && `edit-input-error`)}
          type={type}
          placeholder={placeholder}
          style={{ width: `${width}%`, fontSize: `${size}rem` }}
          onChange={onChange}
          value={value}
          name={name}
          min={min}
          max={max}
        />
        {error && <p className="input-error-text">{error}</p>}
      </div>
    </div>
  );
};

export default EditInput;
