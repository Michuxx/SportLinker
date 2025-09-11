import "./button.css";

const Button = ({ children, style, width, onClick, Icon }) => {
  const buttonType = {
    loginButton: "loginButton",
    createOfferButton: "createOfferButton",
    outlineButton: "outlineButton",
    modalCloseButton: "modalCloseButton",
    loginSwitchButton: "loginSwitchButton",
  };

  const buttonStyle = buttonType[style];

  return (
    <button
      className={buttonStyle}
      style={{ width: `${width}%` }}
      onClick={onClick}
    >
      {Icon || ""}
      {children || ""}
    </button>
  );
};

export default Button;
