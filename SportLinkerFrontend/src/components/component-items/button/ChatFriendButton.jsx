import { useCallback, useEffect, useRef, useState } from "react";
import useDifferenceDates from "../../../hooks/useDifferenceDates";
import OnlineAvatar from "../avatar/OnlineAvatar";
import Dropdown from "../dropdown/Dropdown";
import Button from "./button";
import "./chatFriendButton.css";
import { HiDotsVertical } from "react-icons/hi";
import { FiFlag } from "react-icons/fi";

const ChatFriendButton = ({ onClick, name, date, isOnline }) => {
  const [isFriendDropdownOpen, setIsFriendDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const formattedDate = useDifferenceDates(date);

  const formattedDateText =
    formattedDate !== 0
      ? `Ostatnio aktywny ${formattedDate} dni temu`
      : `Ostatnio dzisiaj online`;

  const friendDropdownOptions = [
    {
      style: "classicDropdownOptionButton",
      onClick: () => setIsParticipantsModalOpen(true),
      text: "Usuń znajomego",
      // icon: <GrGroup size={22} />,
    },
    {
      style: "logoutDropdownOptionButton",
      // onClick: () => changeLocation("/"),
      text: "Zgłoś",
      icon: <FiFlag size={22} />,
    },
  ];

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsFriendDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      className="chat-friend-btn"
      role="button"
      tabIndex={0}
      onClick={onClick}
      ref={dropdownRef}
    >
      <div className="chat-friend-wrapper">
        <div className="chat-friend-avatar">
          <OnlineAvatar size={3} isOnline={isOnline} />
        </div>
        <div className="chat-friend-info-wrapper">
          <div className="chat-friend-info">
            <h3>{name}</h3>
            <span>{isOnline ? `Online` : formattedDateText}</span>
          </div>
        </div>
      </div>
      <Button
        style="popupSettingsButton"
        Icon={<HiDotsVertical size={18} />}
        onClick={(e) => {
          e.stopPropagation();
          setIsFriendDropdownOpen(true);
        }}
      />

      {isFriendDropdownOpen && (
        <div className="friend-dropdown">
          <Dropdown
            options={friendDropdownOptions}
            textKey="text"
            isScrollable={false}
          />
        </div>
      )}
    </div>
  );
};

export default ChatFriendButton;
