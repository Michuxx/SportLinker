import Input from "../../component-items/input/Input";
import InputField from "../../component-items/inputField/InputField";
import Select from "../../component-items/select/Select";
import "./offerFilter.css";
import searchIcon from "/search-icon.svg";
import { LuFilter } from "react-icons/lu";

const OfferFilter = () => {
  return (
    <div className="filter-wrapper">
      <div className="filter-headline">
        <LuFilter color="#3b82f6" size="24px" />
        <h3>Filtruj oferty</h3>
      </div>
      <div className="filter-input-wrapper">
        <InputField label="Szukaj">
          <Input
            placeholder="Szukaj w ofertach..."
            type="text"
            icon={searchIcon}
            width={97}
          />
        </InputField>
        <InputField label="Sport">
          <Select width={97} />
        </InputField>
        <InputField label="Lokalizacja">
          <Input placeholder="np. Warszawa" type="text" width={97} />
        </InputField>
      </div>
    </div>
  );
};

export default OfferFilter;
