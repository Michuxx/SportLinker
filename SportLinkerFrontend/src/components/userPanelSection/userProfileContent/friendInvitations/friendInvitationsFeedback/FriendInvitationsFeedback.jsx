import NullComponent from "../../../../component-items/nullComponent/NullComponent";
import Button from "../../../../component-items/button/button";

const FriendInvitationsFeedback = ({ type, onRetry }) => {
  if (type === "login") return <NullComponent icon="🔒" title="Zaloguj się" text="Zaloguj się, aby zobaczyć zaproszenia do znajomych." />;
  if (type === "loading") return <p role="status">Ładowanie zaproszeń do znajomych...</p>;
  return (
    <div role="alert">
      <NullComponent icon="📨" title="Nie udało się pobrać zaproszeń" text="Sprawdź połączenie i spróbuj ponownie.">
        <Button style="gradientButton" onClick={onRetry}>Spróbuj ponownie</Button>
      </NullComponent>
    </div>
  );
};

export default FriendInvitationsFeedback;
