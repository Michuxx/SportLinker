import NullComponent from "../../../../component-items/nullComponent/NullComponent";
import "./nullStatuses.css";
const NullStatuses = () => {
  return (
    <div className="null-statuses-wrapper">
      <NullComponent
        icon="📆"
        title="Brak wysłanych próśb"
        text="Nie masz żadnych próśb o dołączenie do ofert."
      ></NullComponent>
    </div>
  );
};

export default NullStatuses;
