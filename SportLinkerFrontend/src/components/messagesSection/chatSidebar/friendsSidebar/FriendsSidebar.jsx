import { useOutletContext } from "react-router";

const FriendsSidebar = () => {
  const { chatPeople, onChatSelect } = useOutletContext();
  return <div className="friends-sidebar-wrapper">friends</div>;
};

export default FriendsSidebar;
