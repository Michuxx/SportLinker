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
    />
  );
};

export default Input;
