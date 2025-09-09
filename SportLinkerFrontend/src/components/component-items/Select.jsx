import "./select.css";

const Select = ({ width }) => {
  return (
    <select
      name="sport"
      className="standard-select"
      style={{ width: `${width}%` }}
    >
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
