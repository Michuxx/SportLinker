import { NavLink, Outlet } from "react-router";
import UserNavbar from "./userNavbar/UserNavbar";
import UserProfileContent from "./userProfileContent/UserProfileContent";
import "./userPanelSection.css";
import { LuUser } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import { FiMail } from "react-icons/fi";
import { LuMailQuestion } from "react-icons/lu";

const UserPanelSection = () => {
  return (
    <div className="user-panel-section-wrapper">
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
            Prośby o dołączenie do twoich ofert
          </div>
        </NavLink>
        <NavLink
          to="offerStatuses"
          className={({ isActive }) =>
            `nav-user-menu-option ${
              isActive
                ? "active-nav-user-menu-option"
                : "inactive-nav-user-menu-option"
            }`
          }
        >
          <div className="user-menu-option-wrapper">
            <LuMailQuestion size={24} />
            Statusy ofert
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
