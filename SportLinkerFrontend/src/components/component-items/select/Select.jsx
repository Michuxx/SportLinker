import "./select.css";

const Select = ({
  width,
  options,
  defaultValue,
  defaultText,
  icon,
  error,
  onChange,
  name,
  value,
  disabled = false,
}) => {
  return (
    <div className="select-wrapper">
      {icon && <span>{icon}</span>}
      <select
        disabled={disabled}
        name={name}
        className={
          (icon
            ? `standard-select standard-select-with-icon `
            : `standard-select `) + (error && ` select-error`)
        }
        style={{ width: `${width}%` }}
        onChange={onChange}
        value={value || defaultValue}
      >
        {defaultValue && <option value={defaultValue}>{defaultText}</option>}
        {options.map((opt, index) => (
          <option value={opt.value} key={index}>
            {opt.text}
          </option>
        ))}
      </select>
      {error && <p className="select-error-text">{error}</p>}
    </div>
  );
};

export default Select;
