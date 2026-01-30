import "./offerMemberCard.css";
import Avatar from "../../../../component-items/avatar/Avatar";
import Button from "../../../../component-items/button/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import BackgroundModal from "../../../../component-items/modal/ModalBackground";
import WarningModal from "../../../../warningModal/WarningModal";

const OfferMemberCard = ({ member, offerAuthorId, kickPlayer }) => {
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const dateObj = new Date(member.joinDate);
  const normalizedDate = dateObj.toLocaleDateString("pl-PL");

  return (
    <div className="offer-member-card-container">
      <div className="member-info-block">
        <Avatar size={3} />
        <div className="member-info-wrapper">
          <p className="member-name">{member.name}</p>
          {member.id === offerAuthorId ? (
            <p className="author-member">Organizator</p>
          ) : (
            <p className="member-join-date">{normalizedDate}</p>
          )}
        </div>
      </div>
      {member.id !== offerAuthorId && (
        <div className="member-delete-btn">
          <Button
            style="deleteButton"
            Icon={<FaRegTrashAlt size={20} />}
            onClick={() => setIsKickModalOpen(true)}
          ></Button>
        </div>
      )}
      {isKickModalOpen && (
        <BackgroundModal closeModal={() => setIsKickModalOpen(false)}>
          <WarningModal
            onCancel={() => setIsKickModalOpen(false)}
            headline={`Czy na pewno chcesz wyrzucić ${member.name}?`}
            confirmText="Wyrzuć"
            confirmIcon={<FaRegTrashAlt size={20} />}
            onConfirm={() => kickPlayer(member.id)}
          />
        </BackgroundModal>
      )}
    </div>
  );
};

export default OfferMemberCard;
