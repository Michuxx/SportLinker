import Input from "../../component-items/input/Input";
import InputField from "../../component-items/inputField/InputField";
import Select from "../../component-items/select/Select";
import "./offerFilter.css";
import { IoSearchOutline } from "react-icons/io5";
import { LuFilter } from "react-icons/lu";
import { SPORT_OFFERS } from "../../../assets/SPORT_OFFERS.js";

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
            icon={<IoSearchOutline color="rgb(156 163 175)" size="20px" />}
            width={97}
          />
        </InputField>
        <InputField label="Sport">
          <Select
            width={97}
            options={SPORT_OFFERS}
            defaultValue="all"
            defaultText="Wszystkie"
          />
        </InputField>
        <InputField label="Lokalizacja">
          <Input placeholder="np. Warszawa" type="text" width={97} />
        </InputField>
      </div>
    </div>
  );
};

export default OfferFilter;
