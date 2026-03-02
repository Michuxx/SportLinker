import { useCallback, useEffect, useRef, useState } from "react";
import useDifferenceDates from "../../../hooks/useDifferenceDates";
import OnlineAvatar from "../../component-items/avatar/OnlineAvatar";
import Button from "../../component-items/button/button";
import "./conversation.css";
import { HiDotsHorizontal } from "react-icons/hi";
import Dropdown from "../../component-items/dropdown/Dropdown";
import { FiFlag } from "react-icons/fi";
import { GrGroup } from "react-icons/gr";
import { MdOutlineBlock } from "react-icons/md";

const ConversationHeader = ({ chatUser }) => {
  const [isOpenChatDropdown, setIsOpenChatDropdown] = useState(false);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenChatDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const dropdownRef = useRef(null);

  const formattedDate = useDifferenceDates(chatUser.lastTimeOnline);

  const formattedDateText =
    formattedDate !== 0
      ? `Ostatnio aktywny ${formattedDate} dni temu`
      : `Ostatnio dzisiaj online`;

  const privateConversationDropdown = [
    {
      style: "classicDropdownOptionButton",
      // onClick: () => changeLocation("/"),
      text: "Zablokuj",
      icon: <MdOutlineBlock size={22} />,
    },
    {
      style: "logoutDropdownOptionButton",
      // onClick: () => changeLocation("/"),
      text: "Zgłoś",
      icon: <FiFlag size={22} />,
    },
  ];

  const groupConversationDropdown = [
    {
      style: "classicDropdownOptionButton",
      // onClick: () => changeLocation("/profile/userInfo"),
      text: "Uczestnicy",
      icon: <GrGroup size={22} />,
    },
    {
      style: "logoutDropdownOptionButton",
      // onClick: () => changeLocation("/"),
      text: "Zgłoś",
      icon: <FiFlag size={22} />,
    },
  ];

  return (
    <div className="conversation-header-wrapper" ref={dropdownRef}>
      <div className="avatar-info-wrapper">
        <OnlineAvatar size={3} isOnline={chatUser.isOnline} />
        <div className="user-info-header-wrapper">
          <h3>{`${chatUser.type === "group" ? "Grupa: " : ""} ${
            chatUser.name
          }`}</h3>
          <span>{chatUser.isOnline ? "Online" : formattedDateText}</span>
        </div>
      </div>
      <div className="conversation-btn-wrapper">
        <Button
          style="popupSettingsButton"
          Icon={<HiDotsHorizontal size={25} />}
          onClick={() => setIsOpenChatDropdown(true)}
        />
      </div>
      {isOpenChatDropdown && (
        <div className="conversation-dropdown">
          <Dropdown
            options={
              chatUser.type === "private"
                ? privateConversationDropdown
                : groupConversationDropdown
            }
            textKey="text"
            isScrollable={false}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationHeader;
