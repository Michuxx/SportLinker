import Tooltip from "../tooltip/Tooltip";
import "./inputField.css";

const InputField = ({
  label,
  children,
  error,
  tooltipDirection,
  tooltipText,
  tooltipIcon,
}) => {
  return (
    <div className="input-field-wrapper">
      <div className="input-info-wrapper">
        <p>{label}</p>
        {tooltipDirection && tooltipText && (
          <Tooltip
            direction={tooltipDirection}
            text={tooltipText}
            icon={tooltipIcon}
          />
        )}
      </div>
      {children}
      {error && <span>{error}</span>}
    </div>
  );
};

export default InputField;
