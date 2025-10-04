import Button from "../component-items/button/button.jsx";
import "./header.css";

const Header = ({ openModal }) => {
  return (
    <header>
      <div className="header-wrapper">
        <div className="header-logo">SportLinker</div>
        <div className="btn-section">
          <Button
            style="loginModalButton"
            width={60}
            onClick={() => openModal((e) => !e)}
          >
            Zaloguj się
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
