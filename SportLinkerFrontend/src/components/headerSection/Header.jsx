import Button from "../component-items/button.jsx";
import "./header.css";

const Header = () => {
  return (
    <header>
      <div className="header-wrapper">
        <div className="header-logo">SportLinker</div>
        <div className="btn-section">
          <Button text="Log in" style="loginButton" width={50} />
        </div>
      </div>
    </header>
  );
};

export default Header;
