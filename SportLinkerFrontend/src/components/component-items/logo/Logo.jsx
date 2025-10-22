import "./logo.css";
import logo from "/logo.svg";

const Logo = () => {
  return (
    <div className="logo-wrapper">
      <img src={logo} alt="Logo" />
    </div>
  );
};

export default Logo;
