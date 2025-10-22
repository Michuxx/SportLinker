import Button from "../component-items/button/button.jsx";
import Logo from "../component-items/logo/Logo.jsx";
import Logotype from "../component-items/logo/Logotype.jsx";
import "./header.css";

const Header = ({ openModal }) => {
  return (
    <header>
      <div className="header-wrapper">
        <div className="header-logo">
          <Logo />
          <Logotype />
        </div>
        <div className="btn-section">
          <Button
            style="loginModalButton"
            width={60}
            height={50}
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
