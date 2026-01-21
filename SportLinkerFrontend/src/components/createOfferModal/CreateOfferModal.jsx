import InputField from "../component-items/inputField/InputField";
import Select from "../component-items/select/Select";
import "./createOfferModal.css";
import { SPORT_OFFERS } from "../../assets/SPORT_OFFERS.js";
import { LEVEL } from "../../assets/LEVEL.js";
import { LuTrophy } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { MdInfoOutline } from "react-icons/md";
import Input from "../component-items/input/Input.jsx";
import Textarea from "../component-items/textarea/Textarea.jsx";
import { CREATE_OFFER_VALUES } from "../../assets/CREATE_OFFER_VALUES.js";
import RadioButton from "../component-items/radio/RadioButton.jsx";
import Button from "../component-items/button/button.jsx";
import { useState } from "react";
import ModalHeader from "../component-items/modal/ModalHeader.jsx";
import SearchInput from "../component-items/input/SearchInput.jsx";

const CreateOfferModal = () => {
  const [offerData, setOfferData] = useState({
    sport: "none",
    level: "any",
    title: "",
    description: "",
    location: {
      city: "",
      coordinates: [],
      country: "",
      displayLabel: "",
      houseNumber: "",
      name: "",
      state: "",
      street: "",
      type: "",
    },
    locationQuery: "",
    date: "",
    time: "",
    players: 2,
    mode: "public",
  });

  const [errors, setErrors] = useState({
    sport: "",
    title: "",
    description: "",
    locationQuery: "",
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

  const handleChangeSearchQuery = (e) => {
    setOfferData((prev) => ({
      ...prev,
      locationQuery: e,
      location: null,
    }));
    setErrors((prev) => ({
      ...prev,
      locationQuery: "",
    }));
  };

  const handleChangeLocation = (newLocation) => {
    setOfferData((prev) => ({ ...prev, location: newLocation }));
    setErrors((prev) => ({
      ...prev,
      locationQuery: "",
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    let isValid = true;

    const now = new Date();
    const todaysDate = now.toLocaleDateString("en-CA");
    const currentTime = now.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // --- 1. SPORT ---
    if (offerData.sport === "none") {
      newErrors.sport = "Wybierz sport";
      isValid = false;
    }

    // --- 2. TYTUŁ ---
    if (!offerData.title.trim()) {
      newErrors.title = "Tytuł nie może być pusty";
      isValid = false;
    } else if (offerData.title.length > 50) {
      newErrors.title = "Tytuł nie może mieć więcej niż 50 znaków";
      isValid = false;
    }

    // --- 3. OPIS ---
    if (!offerData.description.trim()) {
      newErrors.description = "Opis nie może być pusty";
      isValid = false;
    } else if (offerData.description.length > 180) {
      newErrors.description = "Opis nie może mieć więcej niż 180 znaków";
      isValid = false;
    }

    // --- 4. LOKALIZACJA ---
    if (!offerData.locationQuery.trim() || offerData.location === null) {
      newErrors.locationQuery =
        "Lokalizacja nie może być pusta. Wybierz ją z listy";
      isValid = false;
    }

    // --- 5. DATA ---
    if (!offerData.date) {
      newErrors.date = "Data nie może być pusta";
      isValid = false;
    } else if (offerData.date < todaysDate) {
      newErrors.date = "Data nie może być wcześniejsza niż dziś";
      isValid = false;
    }

    // --- 6. GODZINA ---
    if (!offerData.time) {
      newErrors.time = "Godzina spotkania nie może być pusta";
      isValid = false;
    } else if (offerData.date === todaysDate && offerData.time < currentTime) {
      newErrors.time = "Godzina spotkania nie może być wcześniejsza niż teraz";
      isValid = false;
    }

    // --- 7. GRACZE ---
    const playersAmount = parseInt(offerData.players, 10);
    if (isNaN(playersAmount)) {
      newErrors.players = "Nieprawidłowa ilość graczy";
      isValid = false;
    } else if (playersAmount < 2) {
      newErrors.players = "Musi być co najmniej 2 graczy";
      isValid = false;
    } else if (playersAmount > 30) {
      newErrors.maxPeople = "Może być maksymalnie 30 graczy";
      isValid = false;
    }
    setErrors(newErrors);

    if (isValid) {
      console.log("Stworzono!");
    }
  };

  return (
    <div className="offer-modal-wrapper">
      <ModalHeader
        title="Utwórz nową ofertę"
        description="Znajdź partnerów do swojego ulubionego sportu"
      />
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
          maxLetters={180}
        />
      </InputField>
      <InputField label="Lokalizacja">
        <SearchInput
          placeholder="np. Katowice, Księdza Józefa Szafranka 9"
          icon={<GrLocation color="rgb(156, 163, 175)" size={20} />}
          width={100}
          onCitySelect={handleChangeLocation}
          name="location"
          value={offerData.locationQuery}
          setValue={handleChangeSearchQuery}
          error={errors.locationQuery}
        />
      </InputField>
      <div className="offer-modal-date-wrapper">
        <InputField label="Data">
          <Input
            type="date"
            icon={<FiCalendar color="rgb(156, 163, 175)" size={20} />}
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
            <b>Prywatny</b> - wysyłana jest prośba o dołączenie do oferty.
            <br />
            <b>Publiczny</b> - każdy może dołączyć bez pytania
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
