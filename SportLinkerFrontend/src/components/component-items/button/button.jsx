import "./button.css";

const Button = ({ children, style, width, height, onClick, Icon }) => {
  const buttonType = {
    loginModalButton: "loginModalButton",
    loginButton: "loginButton",
    createOfferModalButton: "createOfferModalButton",
    outlineButton: "outlineButton",
    modalCloseButton: "modalCloseButton",
    loginSwitchButton: "loginSwitchButton",
    createOfferButton: "createOfferButton",
    dropDownButton: "dropDownButton",
    classicDropdownOptionButton: "classicDropdownOptionButton",
    logoutDropdownOptionButton: "logoutDropdownOptionButton",
    classicBlueButton: "classicBlueButton",
    classicGreenButton: "classicGreenButton",
    classicGreyButton: "classicGreyButton",
    classicRedButton: "classicRedButton",
    gradientButton: "gradientButton",
    deleteButton: "deleteButton",
    registerModalButton: "registerModalButton",
    actionButton: "actionButton",
    actionWarningButton: "actionWarningButton",
    offerPageJoinButton: "offerPageJoinButton",
    offerPageJoinedButton: "offerPageJoinedButton",
  };

  const buttonStyle = buttonType[style];

  return (
    <button
      className={buttonStyle}
      style={{ width: `${width}%`, height: `${height}%` }}
      onClick={onClick}
    >
      {Icon || ""}
      {children || ""}
    </button>
  );
};

export default Button;
