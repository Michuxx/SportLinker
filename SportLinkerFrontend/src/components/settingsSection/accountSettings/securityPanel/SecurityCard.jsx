import "./securityPanel.css";
import Button from "../../../component-items/button/button";

const SecurityCard = ({
  header,
  text,
  borderColor,
  bgColor,
  fontColor,
  buttonStyle,
  buttonText,
  buttonIcon,
}) => {
  return (
    <div
      className="security-card-wrapper"
      style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
    >
      <h4 style={{ color: fontColor }}>{header}</h4>
      <p style={{ color: fontColor }}>{text}</p>
      <div className="security-card-btn">
        <Button Icon={buttonIcon} style={buttonStyle}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default SecurityCard;
