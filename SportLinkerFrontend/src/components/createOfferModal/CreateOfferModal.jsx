import InputField from "../component-items/inputField/InputField";
import Select from "../component-items/select/Select";
import "./createOfferModal.css";
import { SPORT_OFFERS } from "../../assets/SPORT_OFFERS.js";
import { LEVEL } from "../../assets/LEVEL.js";
import { LuTrophy } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import { GrLocation } from "react-icons/gr";
import { CiCalendar } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { MdInfoOutline } from "react-icons/md";
import Input from "../component-items/input/Input.jsx";
import Textarea from "../component-items/textarea/Textarea.jsx";
import { CREATE_OFFER_VALUES } from "../../assets/CREATE_OFFER_VALUES.js";
import RadioButton from "../component-items/radio/RadioButton.jsx";

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
      <InputField label="Tytuł oferty">
        <Input
          placeholder="np. Poszukuję partnera do tenisa"
          type="text"
          icon={<GrNotes color="rgb(156, 163, 175)" size={20} />}
          width={100}
        />
      </InputField>
      <InputField label="Opis">
        <Textarea placeholder="Opisz szczegóły swojej oferty..." width={100} />
      </InputField>
      <InputField label="Lokalizacja">
        <Input
          placeholder="np. Warszawa, Centrum"
          type="text"
          icon={<GrLocation color="rgb(156, 163, 175)" size={20} />}
          width={100}
        />
      </InputField>
      <div className="offer-modal-date-wrapper">
        <InputField label="Data">
          <Input
            type="date"
            icon={<CiCalendar color="rgb(156, 163, 175)" size={20} />}
            width={100}
          />
        </InputField>
        <InputField label="Godzina">
          <Input type="time" width={100} />
        </InputField>
        <InputField label="Max graczy">
          <Input
            type="number"
            icon={<GoPeople color="rgb(156, 163, 175)" size={20} />}
            width={100}
            min={2}
            max={30}
          />
        </InputField>
      </div>
      <InputField
        label="Tryb aplikacji"
        tooltipDirection="right"
        tooltipText={
          <>
            W Trybie aplikacji <b>Zamkniętym</b> - wysyłana jest prośba o
            dołączenie do oferty.
            <br />W trybie <b>Otwartym</b> każdy może dołączyć bez pytania
          </>
        }
        tooltipIcon={<MdInfoOutline size={20} />}
      >
        <div className="radio-btn-wrapper">
          <RadioButton data={CREATE_OFFER_VALUES} name="application" />
        </div>
      </InputField>
    </div>
  );
};

export default CreateOfferModal;
