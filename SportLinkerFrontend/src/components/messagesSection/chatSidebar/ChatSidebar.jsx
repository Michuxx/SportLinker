import { NavLink, Outlet } from "react-router";
import Navbar from "../../component-items/navbar/Navbar";

const ChatSidebar = () => {
  return (
    <div className="chat-sidebar-wrapper">
      <div className="chat-switcher">
        <Navbar>
          <NavLink
            to="conversations"
            className={({ isActive }) =>
              `nav-user-menu-option ${
                isActive
                  ? "active-nav-user-menu-option"
                  : "inactive-nav-user-menu-option"
              }`
            }
          >
            <div className="user-menu-option-wrapper">Konwersacje</div>
          </NavLink>
          <NavLink
            to="friends"
            className={({ isActive }) =>
              `nav-user-menu-option ${
                isActive
                  ? "active-nav-user-menu-option"
                  : "inactive-nav-user-menu-option"
              }`
            }
          >
            <div className="user-menu-option-wrapper">Znajomi</div>
          </NavLink>
        </Navbar>
      </div>
      <Outlet />
    </div>
  );
};

export default ChatSidebar;
