import { useState } from "react";
import "./invitationCard.css";
import Tag from "../../../../component-items/tags/Tag";
import Button from "../../../../component-items/button/button";

const InvitationCard = ({ invitation }) => {
  return (
    <div className="invitation-card-wrapper">
      <div className="invitation-card-tag-wrapper">
        <div className="invitation-card-block">
          <Tag styleType="sport" text={invitation.sport} />
          <Tag styleType={invitation.status} />
        </div>
        <div className="invitation-btn-wrapper">
          <Button>Akceptuj</Button>
          <Button>Odrzuć</Button>
        </div>
      </div>
      <div className="invitation-user-info-wrapper"></div>
    </div>
  );
};

export default InvitationCard;
