import NullComponent from "../../../../component-items/nullComponent/NullComponent";
import "./nullInvitations.css";
const NullInvitations = () => {
  return (
    <div className="null-invitation-wrapper">
      <NullComponent
        icon="📨"
        title="Brak zaproszeń do twoich ofert"
        text="Nie ma żadnych zaproszeń do twoich prywatnych ofert"
      ></NullComponent>
    </div>
  );
};

export default NullInvitations;
