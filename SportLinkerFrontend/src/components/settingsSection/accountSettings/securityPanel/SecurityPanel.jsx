import SecurityCard from "./SecurityCard";
import "./securityPanel.css";

const SecurityPanel = ({ options }) => {
  return (
    <div className="security-settings-wrapper">
      {options.map((card) => (
        <SecurityCard
          header={card.header}
          text={card.text}
          borderColor={card.borderColor}
          bgColor={card.bgColor}
          fontColor={card.fontColor}
          buttonStyle={card.buttonStyle}
          buttonText={card.buttonText}
          buttonIcon={card.buttonIcon}
        />
      ))}
    </div>
  );
};

export default SecurityPanel;
