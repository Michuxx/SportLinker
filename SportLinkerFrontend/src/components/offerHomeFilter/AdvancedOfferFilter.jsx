import Input from "../component-items/input/Input.jsx";
import InputField from "../component-items/inputField/InputField.jsx";
import Select from "../component-items/select/Select.jsx";
import "./offerFilter.css";
import { ALL_LEVEL } from "../../assets/ALL_LEVEL.js";
import { SORT_OPTIONS } from "../../assets/SORT_OPTIONS.js";
import { SORT_ORDER } from "../../assets/SORT_ORDER.js";
import { LuTrophy } from "react-icons/lu";
import { FiCalendar } from "react-icons/fi";
import { GoPeople } from "react-icons/go";

const AdvancedOfferFilter = ({ filter, onChangeFilter }) => {
  return (
    <>
      <div className="advanced-filter-level-dates">
        <InputField label="Poziom umiejętności">
          <Select
            value={filter.level}
            name="level"
            onChange={(e) => onChangeFilter(e)}
            width={97}
            options={ALL_LEVEL}
            defaultValue="all"
            defaultText="Wszystkie poziomy"
            icon={<LuTrophy color="rgb(156, 163, 175)" size={20} />}
          />
        </InputField>
        <InputField label="Data od">
          <Input
            type="date"
            icon={<FiCalendar color="rgb(156, 163, 175)" size={20} />}
            width={97}
            onChange={(e) => onChangeFilter(e)}
            name="minDate"
            value={filter.minDate}
            min={new Date().toISOString().split("T")[0]}
          />
        </InputField>
        <InputField label="Data do">
          <Input
            type="date"
            icon={<FiCalendar color="rgb(156, 163, 175)" size={20} />}
            width={97}
            onChange={(e) => onChangeFilter(e)}
            name="maxDate"
            value={filter.maxDate}
            min={new Date().toISOString().split("T")[0]}
          />
        </InputField>
      </div>
      <div className="advanced-filter-people-sorting">
        <InputField label="Min. liczba uczestników">
          <Input
            type="number"
            icon={<GoPeople color="rgb(156, 163, 175)" size={20} />}
            width={97}
            min={1}
            max={30}
            onChange={(e) => handleChange(e)}
            name="minPlayers"
            value={filter.minPlayers}
          />
        </InputField>
        <InputField label="Max liczba uczestników">
          <Input
            type="number"
            icon={<GoPeople color="rgb(156, 163, 175)" size={20} />}
            width={97}
            min={1}
            max={30}
            onChange={(e) => handleChange(e)}
            name="maxPlayers"
            value={filter.maxPlayers}
          />
        </InputField>
        <InputField label="Sortuj według">
          <Select
            value={filter.sortType}
            name="sortType"
            onChange={(e) => onChangeFilter(e)}
            width={97}
            options={SORT_OPTIONS}
            icon={<LuTrophy color="rgb(156, 163, 175)" size={20} />}
          />
        </InputField>
        <InputField label="Kolejność sortowania">
          <Select
            value={filter.sortOrder}
            name="sortOrder"
            onChange={(e) => onChangeFilter(e)}
            width={97}
            options={SORT_ORDER}
            icon={<LuTrophy color="rgb(156, 163, 175)" size={20} />}
          />
        </InputField>
      </div>
    </>
  );
};

export default AdvancedOfferFilter;
