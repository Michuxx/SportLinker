import { NavLink, Outlet } from "react-router";
import Navbar from "../../component-items/navbar/Navbar";
import "./chatSidebar.css";
import { FiMessageCircle } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import Input from "../../component-items/input/Input";

const ChatSidebar = ({ chatPeople, onChatSelect, activeChatId }) => {
  return (
    <div className="chat-sidebar-wrapper">
      <div className="chat-switcher">
        <Navbar className={"chat"}>
          <NavLink
            to="conversations"
            className={({ isActive }) =>
              `nav-user-menu-option ${
                isActive
                  ? "active-nav-user-menu-option"
                  : "inactive-nav-user-menu-option"
              }`
            }
            style={{ flex: `1 1 0%` }}
          >
            <div className="user-menu-option-wrapper">
              <FiMessageCircle size={22} />
              Konwersacje
            </div>
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
            style={{ flex: `1 1 0%` }}
          >
            <div className="user-menu-option-wrapper">
              <GoPeople size={22} />
              Znajomi
            </div>
          </NavLink>
        </Navbar>
      </div>
      <div className="chat-search-wrapper">
        <Input
          name="title"
          // value={filter.title}
          // onChange={(e) => onChangeFilter(e)}
          placeholder="Szukaj konwersacji..."
          type="text"
          icon={<IoSearchOutline color="rgb(156 163 175)" size="20px" />}
          width={100}
        />
      </div>
      <Outlet context={{ chatPeople, onChatSelect, activeChatId }} />
    </div>
  );
};

export default ChatSidebar;
