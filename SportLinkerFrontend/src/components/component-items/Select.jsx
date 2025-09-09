import "./select.css";

const Select = () => {
  return (
    <select name="sport" className="standard-select">
      <option value="Wszystkie" selected>
        Wszystkie
      </option>
      <option value="Badminton">Badminton</option>
      <option value="Tenis">Tenis</option>
      <option value="Piłka nożna">Piłka nożna</option>
    </select>
  );
};

export default Select;
