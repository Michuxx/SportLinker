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
import Button from "../component-items/button/button.jsx";
import { useState } from "react";

const CreateOfferModal = () => {
  const [offerData, setOfferData] = useState({
    sport: "none",
    level: "any",
    title: "",
    description: "",
    localization: "",
    date: "",
    time: "",
    players: 2,
    mode: "open",
  });

  const [errors, setErrors] = useState({
    sport: "",
    title: "",
    description: "",
    localization: "",
    date: "",
    time: "",
    players: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const sportValidation = () => {
    if (offerData.sport === "none") {
      setErrors((prev) => ({ ...prev, sport: "Wybierz sport" }));
      return false;
    }
    return true;
  };

  const titleValidation = () => {
    if (offerData.title === "") {
      setErrors((prev) => ({ ...prev, title: "Tytuł nie może być pusty" }));
      return false;
    } else if (offerData.title.length > 50) {
      setErrors((prev) => ({
        ...prev,
        title: "Tytuł nie może mieć więcej niż 50 znaków",
      }));
      return false;
    }
    return true;
  };

  const localizationValidation = () => {
    if (offerData.localization === "") {
      setErrors((prev) => ({
        ...prev,
        localization: "Lokalizacja nie może być pusta",
      }));
      return false;
    }
    return true;
  };

  const dateValidation = () => {
    let todaysDate = new Date().toLocaleDateString("en-CA");
    if (offerData.date === "") {
      setErrors((prev) => ({
        ...prev,
        date: "data nie może być pusta",
      }));
      return false;
    } else if (offerData.date < todaysDate) {
      setErrors((prev) => ({
        ...prev,
        date: "data nie może być wcześniejsza niż dziś",
      }));
      return false;
    }
    return true;
  };

  const timeValidation = () => {
    let todaysDate = new Date().toLocaleDateString("en-CA");
    let todaysTime = new Date().toLocaleTimeString("pl-PL");
    if (offerData.time === "") {
      setErrors((prev) => ({
        ...prev,
        time: "godzina spotkania nie może być pusta",
      }));
      return false;
    } else if (offerData.date === todaysDate && offerData.time < todaysTime) {
      setErrors((prev) => ({
        ...prev,
        time: "godzina spotkania nie może być wcześniejsza niż dziś",
      }));
      return false;
    }
    return true;
  };

  const descriptionValidation = () => {
    if (offerData.description === "") {
      setErrors((prev) => ({
        ...prev,
        description: "Opis nie może być pusty",
      }));
      return false;
    } else if (offerData.description.length > 180) {
      setErrors((prev) => ({
        ...prev,
        description: "Opis nie może mieć więcej niż 180 znaków",
      }));
      return false;
    }
    return true;
  };

  const playersValidation = () => {
    const playersAmount = parseInt(offerData.players);
    if (playersAmount < 2) {
      setErrors((prev) => ({
        ...prev,
        players: "Musi być conajmniej 2 graczy",
      }));
      return false;
    } else if (isNaN(playersAmount)) {
      setErrors((prev) => ({
        ...prev,
        players: "Nieprawidłowa ilość graczy",
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const validatedSport = sportValidation();
    const validatedtitle = titleValidation();
    const validatedDescription = descriptionValidation();
    const validatedLocalization = localizationValidation();
    const validatedDate = dateValidation();
    const validatedTime = timeValidation();
    const validatedPlayers = playersValidation();

    if (
      validatedSport &&
      validatedtitle &&
      validatedDescription &&
      validatedLocalization &&
      validatedDate &&
      validatedTime &&
      validatedPlayers
    ) {
      console.log("Stworzono!");
    }
  };

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
            onChange={(e) => handleChange(e)}
            name="sport"
            error={errors.sport}
            value={offerData.sport}
          />
        </InputField>
        <InputField label="Poziom umiejętności">
          <Select
            width={100}
            options={LEVEL}
            defaultValue="any"
            defaultText="Dowolny poziom"
            icon={<LuTrophy color="rgb(156, 163, 175)" size={20} />}
            onChange={(e) => handleChange(e)}
            name="level"
            value={offerData.level}
          />
        </InputField>
      </div>
      <InputField label="Tytuł oferty">
        <Input
          placeholder="np. Poszukuję partnera do tenisa"
          type="text"
          icon={<GrNotes color="rgb(156, 163, 175)" size={20} />}
          onChange={(e) => handleChange(e)}
          name="title"
          width={100}
          value={offerData.title}
          error={errors.title}
        />
      </InputField>
      <InputField label="Opis">
        <Textarea
          placeholder="Opisz szczegóły swojej oferty..."
          width={100}
          onChange={(e) => handleChange(e)}
          name="description"
          value={offerData.description}
          error={errors.description}
          rows={3}
        />
      </InputField>
      <InputField label="Lokalizacja">
        <Input
          placeholder="np. Warszawa, Centrum"
          type="text"
          icon={<GrLocation color="rgb(156, 163, 175)" size={20} />}
          width={100}
          onChange={(e) => handleChange(e)}
          name="localization"
          value={offerData.localization}
          error={errors.localization}
        />
      </InputField>
      <div className="offer-modal-date-wrapper">
        <InputField label="Data">
          <Input
            type="date"
            icon={<CiCalendar color="rgb(156, 163, 175)" size={20} />}
            width={100}
            onChange={(e) => handleChange(e)}
            name="date"
            value={offerData.date}
            error={errors.date}
            min={new Date().toISOString().split("T")[0]}
          />
        </InputField>
        <InputField label="Godzina">
          <Input
            type="time"
            width={100}
            onChange={(e) => handleChange(e)}
            name="time"
            value={offerData.time}
            error={errors.time}
          />
        </InputField>
        <InputField label="Max graczy">
          <Input
            type="number"
            icon={<GoPeople color="rgb(156, 163, 175)" size={20} />}
            width={100}
            min={2}
            max={30}
            onChange={(e) => handleChange(e)}
            name="players"
            value={offerData.players}
            error={errors.players}
          />
        </InputField>
      </div>
      <InputField
        label="Tryb aplikacji"
        tooltipDirection="top"
        tooltipText={
          <>
            <b>Zamknięty</b> - wysyłana jest prośba o dołączenie do oferty.
            <br />
            <b>Otwarty</b> - każdy może dołączyć bez pytania
          </>
        }
        tooltipIcon={<MdInfoOutline size={20} />}
      >
        <div className="radio-btn-wrapper">
          <RadioButton
            data={CREATE_OFFER_VALUES}
            name="mode"
            onChange={(e) => handleChange(e)}
            value={offerData.mode}
          />
        </div>
      </InputField>
      <Button style="createOfferButton" width={100} onClick={handleSubmit}>
        Dodaj ofertę
      </Button>
    </div>
  );
};

export default CreateOfferModal;
