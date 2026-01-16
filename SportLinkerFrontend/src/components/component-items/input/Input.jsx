import "./input.css";

const Input = ({
  placeholder,
  type,
  icon,
  width,
  error,
  onChange,
  value,
  name,
  min,
  max,
  disabled,
}) => {
  return icon ? (
    <div className="input-wrapper">
      <span>{icon}</span>
      <div className="input-error-wrapper">
        <input
          className={
            `standard-input standard-input-with-icon ` +
            (error && `input-error`)
          }
          type={type}
          placeholder={placeholder}
          style={{ width: `${width}%` }}
          onChange={onChange}
          value={value}
          name={name}
          min={min}
          max={max}
          disabled={disabled}
        />
        {error && <p className="input-error-text">{error}</p>}
      </div>
    </div>
  ) : (
    <div className="input-error-wrapper">
      <input
        disabled={disabled}
        className={`standard-input ` + (error && `input-error`)}
        type={type}
        placeholder={placeholder}
        style={{ width: `${width}%` }}
        onChange={onChange}
        value={value}
        name={name}
        min={min}
        max={max}
      />
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
};

export default Input;
