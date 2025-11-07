import "./inputField.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

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
        {tooltipDirection && tooltipText && (
          <Tippy content={tooltipText} placement={tooltipDirection}>
            {tooltipIcon}
          </Tippy>
        )}
      </div>
      <span>{children}</span>
    </div>
  );
};

export default InputField;
