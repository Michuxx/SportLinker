import "./input.css";

const Input = ({
  placeholder,
  type,
  icon,
  width,
  conditionalClass,
  onChange,
  value,
  name,
  min,
  max,
}) => {
  return icon ? (
    <div className="input-wrapper">
      <span>{icon}</span>
      <input
        className={
          `standard-input standard-input-with-icon ` +
          (conditionalClass && `input-error`)
        }
        type={type}
        placeholder={placeholder}
        style={{ width: `${width}%` }}
        onChange={onChange}
        value={value}
        name={name}
        min={min}
        max={max}
      />
    </div>
  ) : (
    <input
      className={`standard-input ` + (conditionalClass && `input-error`)}
      type={type}
      placeholder={placeholder}
      style={{ width: `${width}%` }}
      onChange={onChange}
      value={value}
      name={name}
      min={min}
      max={max}
    />
  );
};

export default Input;
