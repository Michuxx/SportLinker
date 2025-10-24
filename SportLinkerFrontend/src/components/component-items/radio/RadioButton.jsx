import "./radioButton.css";

const RadioButton = ({ data, name, onChange, value }) => {
  return data.map((radio, index) => (
    <div className="custom-radio" key={index}>
      <input
        type="radio"
        id={radio.id}
        value={radio.value}
        name={name}
        onChange={onChange}
        checked={value === radio.value}
      />
      <label htmlFor={radio.id}>{radio.text}</label>
    </div>
  ));
};

export default RadioButton;
