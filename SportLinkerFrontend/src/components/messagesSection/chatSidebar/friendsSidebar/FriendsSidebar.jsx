import { useOutletContext } from "react-router";
import { useState } from "react";
import ChatFriendButton from "../../../component-items/button/ChatFriendButton";
import ModalBackground from "../../../component-items/modal/ModalBackground";
import WarningModal from "../../../warningModal/WarningModal";
import MessagingFeedback from "../../messagingFeedback/MessagingFeedback";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdPersonRemove } from "react-icons/md";

const FriendsSidebar = () => {
  const { chatPeople, selectFriend, listStatuses, reloadList, search, removeFriend, removingFriendId } = useOutletContext();
  const [friendToRemove, setFriendToRemove] = useState(null);
  const friends = chatPeople.friends.filter((friend) => friend.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  if (listStatuses.friends !== "ready") return <MessagingFeedback loading={listStatuses.friends === "loading"} onRetry={() => reloadList("friends")} />;
  return (
    <div className="friends-sidebar-wrapper">
      {friends.length === 0 && <p className="chat-empty-text">{search ? "Brak pasujących znajomych." : "Nie masz jeszcze znajomych."}</p>}
      {friends.map((friend) => <ChatFriendButton key={friend.id} name={friend.name} date={friend.lastTimeOnline} image={friend.imageUrl} isOnline={friend.isOnline} onClick={() => selectFriend(friend)} openWarningModal={removingFriendId === null ? () => setFriendToRemove(friend) : undefined} />)}
      {friendToRemove && (
        <ModalBackground closeModal={() => setFriendToRemove(null)}>
          <WarningModal onCancel={() => setFriendToRemove(null)} onConfirm={() => removeFriend(friendToRemove)} mainIcon={<MdPersonRemove size={96} color="rgb(220 38 38)" />} headline={`Czy na pewno chcesz usunąć ${friendToRemove.name} z listy znajomych?`} confirmText="Tak, usuń" confirmIcon={<FaRegTrashAlt size={20} />} />
        </ModalBackground>
      )}
    </div>
  );
};
export default FriendsSidebar;
