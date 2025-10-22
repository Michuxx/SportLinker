import "./button.css";

const Button = ({ children, style, width, height, onClick, Icon }) => {
  const buttonType = {
    loginModalButton: "loginModalButton",
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
      style={{ width: `${width}%`, height: `${height}%` }}
      onClick={onClick}
    >
      {Icon || ""}
      {children || ""}
    </button>
  );
};

export default Button;
