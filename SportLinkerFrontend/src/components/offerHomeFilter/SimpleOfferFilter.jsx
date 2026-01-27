import Input from "../component-items/input/Input.jsx";
import InputField from "../component-items/inputField/InputField.jsx";
import Select from "../component-items/select/Select.jsx";
import "./offerFilter.css";
import { IoSearchOutline } from "react-icons/io5";
import { SPORT_OFFERS } from "../../assets/SPORT_OFFERS.js";
import { GrLocation } from "react-icons/gr";

const SimpleOfferFilter = ({ filter, onChangeFilter }) => {
  return (
    <>
      <InputField label="Szukaj">
        <Input
          name="title"
          value={filter.title}
          onChange={(e) => onChangeFilter(e)}
          placeholder="Szukaj w ofertach..."
          type="text"
          icon={<IoSearchOutline color="rgb(156 163 175)" size="20px" />}
          width={97}
        />
      </InputField>
      <InputField label="Sport">
        <Select
          value={filter.sport}
          name="sport"
          onChange={(e) => onChangeFilter(e)}
          width={97}
          options={SPORT_OFFERS}
          defaultValue="all"
          defaultText="Wszystkie"
        />
      </InputField>
      <InputField label="Lokalizacja">
        <Input
          value={filter.location}
          placeholder="np. Warszawa"
          name="location"
          onChange={(e) => onChangeFilter(e)}
          type="text"
          width={97}
          icon={<GrLocation color="rgb(156 163 175)" size="20px" />}
        />
      </InputField>
    </>
  );
};

export default SimpleOfferFilter;
