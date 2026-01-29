import { useState } from "react";
import "./reportForm.css";
import InputField from "../../../component-items/inputField/InputField";
import Input from "../../../component-items/input/Input";
import { REPORT_OPTIONS } from "../../../../assets/REPORT_OPTIONS";
import { FiMessageSquare } from "react-icons/fi";
import Select from "../../../component-items/select/Select";
import { FiFlag } from "react-icons/fi";
import Textarea from "../../../component-items/textarea/Textarea";
import Button from "../../../component-items/button/button";

const ReportForm = ({ reportForm, errors, handleChange, handleSubmit }) => {
  return (
    <div className="report-form-wrapper">
      <div className="report-form-headline-wrapper">
        <InputField label="Typ zgłoszenia">
          <Select
            width={100}
            icon={<FiFlag color="rgb(156, 163, 175)" size={20} />}
            options={REPORT_OPTIONS}
            defaultValue={"none"}
            defaultText="Wybierz typ zgłoszenia"
            onChange={(e) => handleChange(e)}
            name="type"
            error={errors.type}
            value={reportForm.type}
          />
        </InputField>
        <InputField label="Tytuł zgłoszenia">
          <Input
            placeholder="Krótki opis problemu"
            type="text"
            icon={<FiMessageSquare color="rgb(156, 163, 175)" size={20} />}
            onChange={(e) => handleChange(e)}
            name="title"
            width={100}
            value={reportForm.title}
            error={errors.title}
          />
        </InputField>
      </div>
      <InputField label="Szczegółowy Opis">
        <Textarea
          placeholder="Opisz szczegółowo problem..."
          width={100}
          onChange={(e) => handleChange(e)}
          name="description"
          value={reportForm.description}
          error={errors.description}
          rows={4}
          maxLetters={400}
        />
      </InputField>
      <div className="report-form-btn">
        <Button style="gradientButton" width={100} onClick={handleSubmit}>
          Wyślij zgłoszenie
        </Button>
      </div>
    </div>
  );
};

export default ReportForm;
