import NullComponent from "../../../../component-items/nullComponent/NullComponent";
import "./nullStatuses.css";
const NullStatuses = () => {
  return (
    <div className="null-statuses-wrapper">
      <NullComponent
        icon="📆"
        title="Brak Ofert w których bierzesz udział"
        text="Nie ma ofert, w których bierzesz udział lub czekasz na zaakceptowanie"
      ></NullComponent>
    </div>
  );
};

export default NullStatuses;
