import { useState, useMemo } from "react";
import "./userDetailed.css";
import "../../../../component-items/multiSelectCss/multiselect.css";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-blue/theme.css";
import Tag from "../../../../component-items/tags/Tag";
import sportService from "../../../../../api/sportService";

const UserDetailedSport = ({ selectedSports, onChange, isEditing }) => {
  const [sports, setSports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const handleDropdownShow = async () => {
    if (hasFetched || isLoading) return;

    setIsLoading(true);
    try {
      const data = await sportService.getSports();
      if (Array.isArray(data)) {
        setSports(data);
        setHasFetched(true);
      }
    } catch (err) {
      console.error("Błąd podczas pobierania listy sportów:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const options = useMemo(() => {
    if (sports.length > 0) return sports;
    return Array.isArray(selectedSports) ? selectedSports : [];
  }, [sports, selectedSports]);

  return (
    <div className="user-detailed-meta-wrapper">
      {isEditing && (
        <MultiSelect
          value={selectedSports}
          dataKey="id"
          onChange={(e) => onChange(e)}
          onShow={handleDropdownShow}
          options={options}
          optionLabel="name"
          name="favouriteSports"
          placeholder="Wybierz sporty..."
          loading={isLoading}
          emptyMessage={
            isLoading ? "Ładowanie sportów..." : "Brak dostępnych sportów"
          }
          emptyFilterMessage="Nie znaleziono sportów"
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
              text={
                sport?.name ||
                sport?.text ||
                (typeof sport === "string" ? sport : "")
              }
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

