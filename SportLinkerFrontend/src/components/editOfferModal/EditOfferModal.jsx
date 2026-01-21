import "./editOfferModal.css";
import ModalHeader from "../component-items/modal/ModalHeader";
import InputField from "../component-items/inputField/InputField";
import Input from "../component-items/input/Input";
import Select from "../component-items/select/Select";
import { LuTrophy } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { MdInfoOutline } from "react-icons/md";
import { LEVEL } from "../../assets/LEVEL";
import { OFFER_AVAILABILITY } from "../../assets/OFFER_AVAILABILITY";
import { CREATE_OFFER_VALUES } from "../../assets/CREATE_OFFER_VALUES";
import { BsDoorOpen } from "react-icons/bs";
import Textarea from "../component-items/textarea/Textarea";
import RadioButton from "../component-items/radio/RadioButton";
import Button from "../component-items/button/button";
import SearchInput from "../component-items/input/SearchInput";

const EditOfferModal = ({
  offerData,
  errors,
  handleChange,
  handleSubmit,
  handleChangeLocation,
  handleChangeSearchQuery,
}) => {
  return (
    <div className="edit-offer-modal-container">
      <ModalHeader title="Edytuj ofertę" />
      <div className="edit-offer-modal-select-wrapper">
        <InputField label="Dostępność oferty">
          <Select
            width={100}
            options={OFFER_AVAILABILITY}
            icon={<BsDoorOpen color="rgb(156, 163, 175)" size={20} />}
            onChange={(e) => handleChange(e)}
            name="availability"
            value={offerData.availability}
            error={errors.availability}
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
            name="maxPeople"
            value={offerData.maxPeople}
            error={errors.maxPeople}
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
        Zapisz zmiany
      </Button>
    </div>
  );
};

export default EditOfferModal;
