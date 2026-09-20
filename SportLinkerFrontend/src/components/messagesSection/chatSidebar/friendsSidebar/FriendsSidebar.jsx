import { useOutletContext } from "react-router";
import ChatFriendButton from "../../../component-items/button/ChatFriendButton";
import { useState } from "react";
import ModalBackground from "../../../component-items/modal/ModalBackground";
import WarningModal from "../../../warningModal/WarningModal";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdPersonRemove } from "react-icons/md";

const FriendsSidebar = () => {
  const { chatPeople, setActiveChatFromFriends } = useOutletContext();

  const [friendToRemove, setFriendToRemove] = useState(null);

  return (
    <div className="friends-sidebar-wrapper">
      {chatPeople.friends.map((friend) => (
        <ChatFriendButton
          key={friend.id}
          name={friend.name}
          date={friend.lastTimeOnline}
          isOnline={friend.isOnline}
          onClick={() => setActiveChatFromFriends(friend)}
          openWarningModal={() => setFriendToRemove(friend)}
        />
      ))}
      {friendToRemove && (
        <ModalBackground closeModal={() => setFriendToRemove(null)}>
          <WarningModal
            onCancel={() => setFriendToRemove(null)}
            mainIcon={<MdPersonRemove size={96} color="rgb(220 38 38)" />}
            headline={`Czy na pewno chcesz usunąć ${friendToRemove.name} z listy znajomych?`}
            confirmText={"Tak, usuń"}
            confirmIcon={<FaRegTrashAlt size={20} />}
          />
        </ModalBackground>
      )}
    </div>
  );
};

export default FriendsSidebar;
