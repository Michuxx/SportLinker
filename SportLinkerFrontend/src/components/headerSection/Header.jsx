import { useNavigate } from "react-router";
import Button from "../component-items/button/button.jsx";
import Logo from "../component-items/logo/Logo.jsx";
import Logotype from "../component-items/logo/Logotype.jsx";
import "./header.css";

const Header = ({ openModal }) => {
  let navigate = useNavigate();

  return (
    <header>
      <div className="header-wrapper">
        <div className="header-logo" onClick={() => navigate("/")}>
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
