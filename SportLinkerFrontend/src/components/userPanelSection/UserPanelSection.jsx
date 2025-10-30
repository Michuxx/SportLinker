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
        <NavLink to="userInfo">UserInfo</NavLink>
        <NavLink to="userOffers">userOffers</NavLink>
        <NavLink to="userInvitations">userInvitations</NavLink>
      </UserNavbar>
      <UserProfileContent>
        <Outlet />
      </UserProfileContent>
    </div>
  );
};

export default UserPanelSection;
