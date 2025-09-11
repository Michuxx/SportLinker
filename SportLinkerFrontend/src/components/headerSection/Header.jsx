import Button from "../component-items/button/button.jsx";
import "./header.css";

const Header = ({ openModal }) => {
  return (
    <header>
      <div className="header-wrapper">
        <div className="header-logo">SportLinker</div>
        <div className="btn-section">
          <Button
            text="Log in"
            style="loginButton"
            width={50}
            onClick={() => openModal((e) => !e)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
