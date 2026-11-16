import Input from "../component-items/input/Input.jsx";
import InputField from "../component-items/inputField/InputField.jsx";
import Select from "../component-items/select/Select.jsx";
import "./offerFilter.css";
import { IoSearchOutline } from "react-icons/io5";
import SearchInput from "../component-items/input/SearchInput.jsx";
import { GrLocation } from "react-icons/gr";

const SimpleOfferFilter = ({ filter, onChangeFilter, sports, errors = {} }) => {
  return (
    <>
      <InputField label="Szukaj">
        <Input
          name="title"
          value={filter.title}
          maxLength={200}
          error={errors.title}
          onChange={(e) => onChangeFilter(e)}
          placeholder="Szukaj w tytułach lub opisach..."
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
          options={sports.options}
          disabled={sports.loading || sports.error}
          defaultValue="all"
          defaultText="Wszystkie"
        />
      </InputField>
      <InputField label="Lokalizacja">
        <SearchInput
          value={filter.locationQuery}
          placeholder="Wybierz miasto..."
          name="location"
          setValue={(value) => onChangeFilter({ target: { name: "locationQuery", value } })}
          onCitySelect={(value) => onChangeFilter({ target: { name: "location", value } })}
          searchType="city"
          error={errors.location}
          width={97}
          icon={<GrLocation color="rgb(156 163 175)" size="20px" />}
        />
      </InputField>
    </>
  );
};

export default SimpleOfferFilter;
