import { useNavigate } from "react-router";
import Button from "../component-items/button/button.jsx";
import Logo from "../component-items/logo/Logo.jsx";
import Logotype from "../component-items/logo/Logotype.jsx";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { LuUser } from "react-icons/lu";
import "./header.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Dropdown from "../component-items/dropdown/Dropdown.jsx";
import ModalBackground from "../component-items/modal/ModalBackground.jsx";
import AuthModal from "../authModal/AuthModal.jsx";
import { LuLogIn } from "react-icons/lu";
import { CgUserAdd } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";

const Header = () => {
  let navigate = useNavigate();
  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoginSelection, setIsLoginSelection] = useState(true); // for security

  const dropdownRef = useRef(null);

  const changeLocation = (url) => {
    navigate(url);
  };

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenUserDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const userDropdown = [
    {
      style: "classicDropdownOptionButton",
      onClick: () => changeLocation("/profile/userInfo"),
      text: "Mój profil",
    },
    {
      style: "classicDropdownOptionButton",
      onClick: () => changeLocation("/settings/account"),
      text: "Ustawienia",
    },
    {
      style: "classicDropdownOptionButton",
      onClick: () => changeLocation("/messages"),
      text: "Wiadomości",
    },
    {
      style: "logoutDropdownOptionButton",
      onClick: () => changeLocation("/"),
      text: "Wyloguj się",
      icon: <CiLogout size={22} />,
    },
  ];

  const handleModal = (selection) => {
    setIsLoginSelection(selection);
    setIsLoginModalOpen((e) => !e);
  };

  return (
    <header>
      <div className="header-wrapper">
        <div className="header-logo" onClick={() => navigate("/")}>
          <Logo />
          <Logotype />
        </div>
        <div className="btn-section" ref={dropdownRef}>
          <Button
            style="registerModalButton"
            width={80}
            height={50}
            Icon={<CgUserAdd size={24} />}
            onClick={() => handleModal(false)}
          >
            Załóż konto
          </Button>
          <Button
            style="loginModalButton"
            width={80}
            height={50}
            Icon={<LuLogIn size={24} />}
            onClick={() => handleModal(true)}
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
            {isOpenUserDropdown ? (
              <IoIosArrowUp size={20} />
            ) : (
              <IoIosArrowDown size={20} />
            )}
          </Button>
          {isOpenUserDropdown && (
            <div className="header-dropdown">
              <Dropdown
                options={userDropdown}
                textKey="text"
                isScrollable={false}
              />
            </div>
          )}
        </div>
      </div>
      {isLoginModalOpen && (
        <ModalBackground closeModal={() => setIsLoginModalOpen(false)}>
          <AuthModal loginSelection={isLoginSelection} />
        </ModalBackground>
      )}
    </header>
  );
};

export default Header;
