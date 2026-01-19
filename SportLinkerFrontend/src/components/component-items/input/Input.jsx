import "./input.css";

const Input = ({
  icon,
  error,
  width,
  type = "text",
  className = "",
  ...props
}) => {
  const inputClasses = [
    "standard-input",
    icon ? "standard-input-with-icon" : "",
    error ? "input-error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-field-container">
      <div className={`input-wrapper ${icon ? "has-icon" : ""}`}>
        {icon && <span className="input-icon-wrapper">{icon}</span>}

        <div className="input-error-wrapper">
          <input
            className={inputClasses}
            type={type}
            style={{ width: `${width}%` }}
            {...props}
          />
          {error && <p className="input-error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Input;
