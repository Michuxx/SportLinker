import { useState } from "react";
import "./invitationCard.css";
import Tag from "../../../../component-items/tags/Tag";

const InvitationCard = ({ invitation }) => {
  return (
    <div className="invitation-card-wrapper">
      <div className="invitation-card-tag-wrapper">
        <div className="invitation-card-block">
          <Tag styleType="sport" text={invitation.sport} />
          <Tag styleType={invitation.status} />
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
