import { useState } from "react";
import "./invitationCard.css";

const InvitationCard = ({ invitation }) => {
  return (
    <div className="invitation-card-wrapper">
      <div className="invitation-card-tag-wrapper">
        <div className="invitation-card-block">
          <span className="sport">{invitation.sport}</span>
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
