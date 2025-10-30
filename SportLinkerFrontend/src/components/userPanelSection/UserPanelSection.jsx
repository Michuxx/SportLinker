import { NavLink, Outlet } from "react-router";
import PageTitle from "../pageTitle/PageTitle";
import UserNavbar from "./userNavbar/UserNavbar";
import UserProfileContent from "./userProfileContent/UserProfileContent";
import "./userPanelSection.css";

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
          UserInfo
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
          userOffers
        </NavLink>
        <NavLink
          to="userInvitations"
          className={({ isActive }) =>
            `nav-user-menu-option ${
              isActive
                ? "active-nav-user-menu-option"
                : "inactive-nav-user-menu-option"
            }`
          }
        >
          userInvitations
        </NavLink>
      </UserNavbar>
      <UserProfileContent>
        <Outlet />
      </UserProfileContent>
    </div>
  );
};

export default UserPanelSection;
