import { useNavigate } from "react-router";
import Button from "../component-items/button/button.jsx";
import Logo from "../component-items/logo/Logo.jsx";
import Logotype from "../component-items/logo/Logotype.jsx";
import { IoIosArrowDown } from "react-icons/io";
import { LuUser } from "react-icons/lu";
import "./header.css";
import { useState } from "react";
import Dropdown from "../component-items/dropdown/Dropdown.jsx";

const Header = ({ openModal }) => {
  let navigate = useNavigate();
  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);

  const changeLocation = (url) => {
    navigate(url);
  };

  const userDropdown = [
    {
      style: "classicDropdownButton",
      onClick: () => changeLocation("/profile"),
      text: "Mój profil",
    },
    {
      style: "classicDropdownButton",
      onClick: () => changeLocation("/profile"),
      text: "Ustawienia",
    },
    {
      style: "logoutDropdownButton",
      onClick: () => changeLocation("/"),
      text: "Wyloguj się",
    },
  ];

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
          <Button
            style="dropDownButton"
            width={60}
            height={50}
            Icon={<LuUser size={24} />}
            onClick={() => setIsOpenUserDropdown((e) => !e)}
          >
            <IoIosArrowDown size={20} />
          </Button>
          {isOpenUserDropdown && (
            <div className="header-dropdown">
              <Dropdown options={userDropdown} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
