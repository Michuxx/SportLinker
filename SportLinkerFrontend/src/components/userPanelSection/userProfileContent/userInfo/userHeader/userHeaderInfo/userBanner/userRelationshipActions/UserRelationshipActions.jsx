import { FiCheck, FiClock, FiLoader, FiUserPlus, FiUsers, FiX } from "react-icons/fi";
import "./userRelationshipActions.css";

const UserRelationshipActions = ({ relationship, isPending = false, onAction }) => {
  if (!relationship || relationship === "anonymous" || relationship === "self") return null;

  return (
    <div className="user-relationship-actions" aria-busy={isPending}>
      {isPending && (
        <span className="user-relationship-progress" role="status">
          <FiLoader aria-hidden="true" />
          <span className="user-relationship-sr-only">Zapisywanie zmian…</span>
        </span>
      )}
      {relationship === "none" && (
        <button type="button" className="user-relationship-button user-relationship-primary" disabled={isPending} onClick={() => onAction("send")}>
          <FiUserPlus aria-hidden="true" />Zaproś do znajomych
        </button>
      )}
      {relationship === "friends" && (
        <span className="user-relationship-status user-relationship-friends" role="status">
          <FiUsers aria-hidden="true" />Jesteście znajomymi
        </span>
      )}
      {relationship === "requestsent" && (
        <span className="user-relationship-status" role="status">
          <FiClock aria-hidden="true" />Zaproszenie wysłane
        </span>
      )}
      {relationship === "requestreceived" && (
        <>
          <button type="button" className="user-relationship-button user-relationship-accept" disabled={isPending} onClick={() => onAction("accept")}>
            <FiCheck aria-hidden="true" />Akceptuj
          </button>
          <button type="button" className="user-relationship-button user-relationship-reject" disabled={isPending} onClick={() => onAction("reject")}>
            <FiX aria-hidden="true" />Odrzuć
          </button>
        </>
      )}
    </div>
  );
};

export default UserRelationshipActions;
