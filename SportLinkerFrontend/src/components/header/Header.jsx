import Button from "../component-items/button";
import "./header.css";

const Header = () => {
  return (
    <header>
      <div className="header-logo">SportLinker</div>
      <div className="btn-section">
        <Button text="Log in" style="loginButton" width={50} />
      </div>
    </header>
  );
};

export default Header;
