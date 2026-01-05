import "./userDetailed.css";
import "../../../../component-items/multiSelectCss/multiselect.css";
import { MultiSelect } from "primereact/multiselect";
import { SPORT_OFFERS } from "../../../../../assets/SPORT_OFFERS";

const UserDetailedSport = ({ selectedSports, onChange }) => {
  return (
    <div className="user-detailed-meta-wrapper">
      <MultiSelect
        value={selectedSports}
        onChange={(e) => onChange(e)}
        options={SPORT_OFFERS}
        optionLabel="text"
        name="favouriteSport"
        placeholder="Wybierz sporty..."
        filter
        filterDelay={400}
      />
    </div>
  );
};

export default UserDetailedSport;
