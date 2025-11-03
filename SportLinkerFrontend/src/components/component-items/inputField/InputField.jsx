import "./inputField.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

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
        {label && <p>{label}</p>}
        {tooltipDirection && tooltipText && (
          <Tippy content={tooltipText} placement={tooltipDirection}>
            {tooltipIcon}
          </Tippy>
        )}
      </div>
      {children}
      {error && <span>{error}</span>}
    </div>
  );
};

export default InputField;
