import "./offerMemberCard.css";
import Avatar from "../../../../component-items/avatar/Avatar";
import Button from "../../../../component-items/button/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import BackgroundModal from "../../../../component-items/modal/ModalBackground";
import WarningModal from "../../../../warningModal/WarningModal";
import { parseApiDate } from "../../../../../utils/dateTime";

const OfferMemberCard = ({ member, offerAuthorId, kickPlayer, isAuthor = false, isBusy = false }) => {
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const isOfferAuthor = String(member.id) === String(offerAuthorId);
  const dateObj = parseApiDate(member.joinDate);
  const normalizedDate = dateObj.toLocaleDateString("pl-PL");

  return (
    <div className="offer-member-card-container">
      <div className="member-info-block">
        <Avatar size={3} image={member.image} />
        <div className="member-info-wrapper">
          <p className="member-name">{member.name}</p>
          {isOfferAuthor ? (
            <p className="author-member">Organizator</p>
          ) : (
            <p className="member-join-date">{normalizedDate}</p>
          )}
        </div>
      </div>
      {isAuthor && !isOfferAuthor && (
        <div className="member-delete-btn">
          <Button
            style="deleteButton"
            Icon={<FaRegTrashAlt size={20} />}
            onClick={() => setIsKickModalOpen(true)}
            disabled={isBusy}
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
            onConfirm={() => !isBusy && kickPlayer(member.id)}
          />
        </BackgroundModal>
      )}
    </div>
  );
};

export default OfferMemberCard;
