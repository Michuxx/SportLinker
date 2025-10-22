import InputField from "../component-items/inputField/InputField";
import Select from "../component-items/select/Select";
import "./createOfferModal.css";
import { SPORT_OFFERS } from "../../assets/SPORT_OFFERS.js";
import { LEVEL } from "../../assets/LEVEL.js";
import { LuTrophy } from "react-icons/lu";

const CreateOfferModal = () => {
  return (
    <div className="offer-modal-wrapper">
      <div className="offer-modal-header">
        <h2>Utwórz nową ofertę</h2>
        <p>Znajdź partnerów do swojego ulubionego sportu</p>
      </div>
      <div className="offer-modal-select-wrapper">
        <InputField label="Sport">
          <Select
            width={100}
            options={SPORT_OFFERS}
            defaultValue="none"
            defaultText="Wybierz Sport"
          />
        </InputField>
        <InputField label="Poziom umiejętności">
          <Select
            width={100}
            options={LEVEL}
            defaultValue="any"
            defaultText="Dowolny poziom"
            icon={<LuTrophy color="rgb(156, 163, 175)" size={20} />}
          />
        </InputField>
      </div>
    </div>
  );
};

export default CreateOfferModal;
