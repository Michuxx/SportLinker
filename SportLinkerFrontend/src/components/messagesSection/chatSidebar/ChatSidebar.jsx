import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "../../component-items/navbar/Navbar";
import { FiMessageCircle, FiRefreshCw } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import Input from "../../component-items/input/Input";
import "./chatSidebar.css";

const ChatSidebar = ({ messaging }) => {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const list = location.pathname.endsWith("friends") ? "friends" : "conversations";
  const selectFriend = (friend) => {
    messaging.selectFriend(friend);
    navigate("/messages/conversations");
  };
  return (
    <div className="chat-sidebar-wrapper">
      <div className="chat-switcher">
        <Navbar className="chat">
          {[["conversations", "Konwersacje", <FiMessageCircle size={22} />], ["friends", "Znajomi", <GoPeople size={22} />]].map(([path, label, icon]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `nav-user-menu-option ${isActive ? "active-nav-user-menu-option" : "inactive-nav-user-menu-option"}`} style={{ flex: "1 1 0%" }}>
              <div className="user-menu-option-wrapper">{icon}{label}</div>
            </NavLink>
          ))}
        </Navbar>
      </div>
      <div className="chat-search-wrapper">
        <Input name="chat-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={list === "friends" ? "Szukaj znajomych..." : "Szukaj konwersacji..."} icon={<IoSearchOutline size={20} />} width={100} />
        <button type="button" className="chat-refresh-button" onClick={() => messaging.reloadList(list)} disabled={messaging.listStatuses[list] === "loading"} aria-label="Odśwież listę" title="Odśwież listę"><FiRefreshCw /></button>
      </div>
      <div className="chat-sidebar-list">
        <Outlet context={{ ...messaging, selectFriend, search }} />
      </div>
    </div>
  );
};

export default ChatSidebar;
