import "./select.css";

const Select = ({
  width,
  options,
  defaultValue,
  defaultText,
  icon,
  conditionalClass,
}) => {
  return icon ? (
    <div className="select-wrapper">
      <span>{icon}</span>
      <select
        name="sport"
        className={
          `standard-select standard-select-with-icon ` +
          (conditionalClass && `select-error`)
        }
        style={{ width: `${width}%` }}
      >
        <option value={defaultValue}>{defaultText}</option>
        {options.map((opt, index) => (
          <option value={opt.value} key={index}>
            {opt.text}
          </option>
        ))}
      </select>
    </div>
  ) : (
    <select
      name="sport"
      className={`standard-select ` + (conditionalClass && `select-error`)}
      style={{ width: `${width}%` }}
    >
      <option value={defaultValue}>{defaultText}</option>
      {options.map((opt, index) => (
        <option value={opt.value} key={index}>
          {opt.text}
        </option>
      ))}
    </select>
  );
};

export default Select;
