import Input from "../component-items/input/Input.jsx";
import InputField from "../component-items/inputField/InputField.jsx";
import Select from "../component-items/select/Select.jsx";
import "./offerFilter.css";
import { ALL_LEVEL } from "../../assets/ALL_LEVEL.js";
import { LuTrophy } from "react-icons/lu";
import { FiCalendar } from "react-icons/fi";
import { GoPeople } from "react-icons/go";

const AdvancedOfferFilter = ({ filter, onChangeFilter }) => {
  return (
    <>
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
    </>
  );
};

export default AdvancedOfferFilter;
