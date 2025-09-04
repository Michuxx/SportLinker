import "./button.css";

const Button = ({ text, style, width }) => {
  const buttonType = {
    loginButton: "loginButton",
  };

  const buttonStyle = buttonType[style];

  return (
    <button className={buttonStyle} style={{ width: `${width}%` }}>
      {text}
    </button>
  );
};

export default Button;
