import { useOutletContext } from "react-router";
import ChatFriendButton from "../../../component-items/button/ChatFriendButton";

const FriendsSidebar = () => {
  const { chatPeople, setActiveChatFromFriends } = useOutletContext();
  return (
    <div className="friends-sidebar-wrapper">
      {chatPeople.friends.map((friend) => (
        <ChatFriendButton
          key={friend.id}
          name={friend.name}
          date={friend.lastTimeOnline}
          isOnline={friend.isOnline}
          onClick={() => setActiveChatFromFriends(friend)}
        />
      ))}
    </div>
  );
};

export default FriendsSidebar;
