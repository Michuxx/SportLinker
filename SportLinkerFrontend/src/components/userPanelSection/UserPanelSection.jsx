import { NavLink, Outlet, useLocation, useParams } from "react-router";
import UserProfileContent from "./userProfileContent/UserProfileContent";
import "./userPanelSection.css";
import { LuUser } from "react-icons/lu";
import { FiMail } from "react-icons/fi";
import { LuMailQuestion } from "react-icons/lu";
import { MdGroupAdd } from "react-icons/md";
import Navbar from "../component-items/navbar/Navbar";
import useAuth from "../../hooks/useAuth";

const UserPanelSection = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { id } = useParams();

  const match = location.pathname.match(/\/userInfo\/([^/?#]+)/);
  const currentProfileId = id || (match ? match[1] : null);

  const isOwner = Boolean(
    user?.id && (!currentProfileId || String(user.id) === String(currentProfileId))
  );

  const profileId = user?.id;
  const isUserInfoActive = location.pathname.includes("/profile/userInfo");

  return (
    <div className="user-panel-section-wrapper">
      {isOwner && (
        <Navbar className={"user"}>
        <NavLink
          to={`userInfo/${profileId}`}
          className={({ isActive }) =>
            `nav-user-menu-option ${
              isActive || isUserInfoActive
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
            Twoje Prośby o dołączenie
          </div>
        </NavLink>
        <NavLink
          to="friendInvitations"
          className={({ isActive }) =>
            `nav-user-menu-option ${
              isActive
                ? "active-nav-user-menu-option"
                : "inactive-nav-user-menu-option"
            }`
          }
        >
          <div className="user-menu-option-wrapper">
            <MdGroupAdd size={24} />
            Zaproszenia do znajomych
          </div>
        </NavLink>
      </Navbar>
      )}
      <UserProfileContent>
        <Outlet />
      </UserProfileContent>
    </div>
  );
};

export default UserPanelSection;
