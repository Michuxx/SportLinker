import { NavLink, Outlet } from "react-router";
import Navbar from "../component-items/navbar/Navbar";
import { LuUser } from "react-icons/lu";

const SettingsSection = () => {
  return (
    <div className="user-panel-section-wrapper">
      <Navbar>
        <NavLink
          to="account"
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
            Konto
          </div>
        </NavLink>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default SettingsSection;
