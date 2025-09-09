import Input from "../../component-items/Input";
import InputField from "../../component-items/InputField";
import Select from "../../component-items/Select";
import "./offerFilter.css";
import searchIcon from "/search-icon.svg";

const OfferFilter = () => {
  return (
    <div className="filter-wrapper">
      <div className="filter-headline">
        <h3>Filtruj oferty</h3>
      </div>
      <div className="filter-input-wrapper">
        <InputField label="Szukaj">
          <Input
            placeholder="Szukaj w ofertach..."
            type="text"
            icon={searchIcon}
          />
        </InputField>
        <InputField label="Sport">
          <Select />
        </InputField>
        <InputField label="Lokalizacja">
          <Input placeholder="np. Warszawa" type="text" />
        </InputField>
      </div>
    </div>
  );
};

export default OfferFilter;
