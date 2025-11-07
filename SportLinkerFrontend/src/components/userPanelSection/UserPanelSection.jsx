import { NavLink, Outlet } from "react-router";
import PageTitle from "../pageTitle/PageTitle";
import UserNavbar from "./userNavbar/UserNavbar";
import UserProfileContent from "./userProfileContent/UserProfileContent";
import "./userPanelSection.css";
import { LuUser } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import { FiMail } from "react-icons/fi";

const UserPanelSection = () => {
  return (
    <div className="user-panel-section-wrapper">
      <PageTitle
        header="Panel użytkownika"
        label="Zarządzaj swoim profilem i aktywnością"
      />
      <UserNavbar>
        <NavLink
          to="userInfo"
          className={({ isActive }) =>
            `nav-user-menu-option ${
              isActive
                ? "active-nav-user-menu-option"
                : "inactive-nav-user-menu-option"
            }`
          }
        >
          <div className="user-menu-option-wrapper">
            <LuUser size={24} />
            Mój profil
          </div>
        </NavLink>
        <NavLink
          to="userOffers"
          className={({ isActive }) =>
            `nav-user-menu-option ${
              isActive
                ? "active-nav-user-menu-option"
                : "inactive-nav-user-menu-option"
            }`
          }
        >
          <div className="user-menu-option-wrapper">
            <GrNotes size={24} />
            Moje oferty
          </div>
        </NavLink>
        <NavLink
          to="myInvitations"
          className={({ isActive }) =>
            `nav-user-menu-option ${
              isActive
                ? "active-nav-user-menu-option"
                : "inactive-nav-user-menu-option"
            }`
          }
        >
          <div className="user-menu-option-wrapper">
            <FiMail size={24} />
            Moje zaproszenia
          </div>
        </NavLink>
        <NavLink
          to="foreignInvitations"
          className={({ isActive }) =>
            `nav-user-menu-option ${
              isActive
                ? "active-nav-user-menu-option"
                : "inactive-nav-user-menu-option"
            }`
          }
        >
          <div className="user-menu-option-wrapper">
            <FiMail size={24} />
            Obce zaproszenia
          </div>
        </NavLink>
        <NavLink
          to="joinedOffers"
          className={({ isActive }) =>
            `nav-user-menu-option ${
              isActive
                ? "active-nav-user-menu-option"
                : "inactive-nav-user-menu-option"
            }`
          }
        >
          <div className="user-menu-option-wrapper">
            <FiMail size={24} />
            Oferty z moim udziałem
          </div>
        </NavLink>
      </UserNavbar>
      <UserProfileContent>
        <Outlet />
      </UserProfileContent>
    </div>
  );
};

export default UserPanelSection;
