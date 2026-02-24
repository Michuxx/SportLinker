import { useOutletContext } from "react-router";
import ChatProfileButton from "../../../component-items/button/ChatConversationButton";

const FriendsSidebar = () => {
  const { chatPeople, onChatSelect } = useOutletContext();
  return (
    <div className="friends-sidebar-wrapper">
      {/* {chatPeople.friends.map((friend) => (
    
      ))} */}
    </div>
  );
};

export default FriendsSidebar;
