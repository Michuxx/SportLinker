import Tooltip from "../tooltip/Tooltip";
import "./inputField.css";

const InputField = ({
  label,
  children,
  tooltipDirection,
  tooltipText,
  tooltipIcon,
}) => {



  return (
    <div className="input-field-wrapper">
      <div className="input-info-wrapper">
        {label && <p className="input-label">{label}</p>}
        <Tooltip tooltipDirection={tooltipDirection} tooltipIcon={tooltipIcon} tooltipText={tooltipText}/>
      </div>
      <span>{children}</span>
    </div>
  );
};

export default InputField;
