import "./userDetailed.css";
import "../../../../component-items/multiSelectCss/multiselect.css";
import { MultiSelect } from "primereact/multiselect";
import { SPORT_OFFERS } from "../../../../../assets/SPORT_OFFERS";
import "primereact/resources/themes/lara-light-blue/theme.css";
import Tag from "../../../../component-items/tags/Tag";

const UserDetailedSport = ({ selectedSports, onChange, isEditing }) => {
  return (
    <div className="user-detailed-meta-wrapper">
      {isEditing && (
        <MultiSelect
          value={selectedSports}
          dataKey="id"
          onChange={(e) => onChange(e)}
          options={SPORT_OFFERS}
          optionLabel="text"
          name="favouriteSports"
          placeholder="Wybierz sporty..."
          filter
          filterDelay={400}
          maxSelectedLabels={3}
          showSelectAll={false}
        />
      )}
      <div className="user-detailed-selected-sports-wrapper">
        {selectedSports && selectedSports.length > 0 ? (
          selectedSports.map((sport, index) => (
            <Tag
              key={sport?.id || index}
              styleType="sport"
              text={sport?.name || sport?.text || (typeof sport === "string" ? sport : "")}
            />
          ))
        ) : (
          <p>Brak ulubionych sportów</p>
        )}
      </div>
    </div>
  );
};

export default UserDetailedSport;
