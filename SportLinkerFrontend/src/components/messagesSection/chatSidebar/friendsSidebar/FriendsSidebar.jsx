import { useOutletContext } from "react-router";
import ChatFriendButton from "../../../component-items/button/ChatFriendButton";

const FriendsSidebar = () => {
  const { chatPeople, onChatSelect } = useOutletContext();
  return (
    <div className="friends-sidebar-wrapper">
      {chatPeople.friends.map((friend) => (
        <ChatFriendButton
          name={friend.name}
          date={friend.lastTimeOnline}
          isOnline={friend.isOnline}
        />
      ))}
    </div>
  );
};

export default FriendsSidebar;
