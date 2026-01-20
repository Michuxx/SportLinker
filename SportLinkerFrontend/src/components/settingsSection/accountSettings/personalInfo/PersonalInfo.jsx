import InputField from "../../../component-items/inputField/InputField";
import Input from "../../../component-items/input/Input";
import Select from "../../../component-items/select/Select";
import "../accountSettings.css";
import { GENDERS } from "../../../../assets/GENDERS";
import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import { MdMailOutline } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { FaTransgender } from "react-icons/fa";
import SearchInput from "../../../component-items/input/SearchInput";

const PersonalInfo = ({
  userInfo,
  errors,
  handleChange,
  handleChangeLocation,
}) => {
  const hideEmail = (email) => {
    if (!email || typeof email !== "string") return "";

    const [localPart, domain] = email.split("@");

    if (localPart.length <= 2) {
      return `${localPart[0]}*@${domain}`;
    }

    const maskedLocal =
      localPart.substring(0, 2) + "*".repeat(localPart.length - 2);

    return `${maskedLocal}@${domain}`;
  };

  const hidePhoneNumber = (number) => {
    if (!number || typeof number !== "string") return "";

    let hiddenNumber = "";

    for (let i = 0; i < number.length; i++) {
      if (i > 2 && i < 10) {
        hiddenNumber += "*";
      } else {
        hiddenNumber += number[i];
      }

      if (i === 2) {
        hiddenNumber += " ";
      } else if ((i - 2) % 3 === 0 && i > 2 && i < number.length) {
        hiddenNumber += " ";
      }
    }
    return hiddenNumber;
  };

  return (
    <>
      <div className="acc-settings-input-wrapper">
        <InputField label="Imię i nazwisko">
          <Input
            placeholder="John Doe"
            type="text"
            width={100}
            icon={<LuUser color="rgb(156 163 175)" size="20px" />}
            onChange={(e) => handleChange(e)}
            value={userInfo.name}
            error={errors.name}
            name="name"
          />
        </InputField>
        <InputField label="Email">
          <Input
            placeholder="John@example.com"
            type="email"
            width={100}
            icon={<MdMailOutline color="rgb(156 163 175)" size="20px" />}
            onChange={(e) => handleChange(e)}
            value={hideEmail(userInfo.email)}
            name="email"
            disabled={true}
          />
        </InputField>
      </div>
      <div className="acc-settings-input-wrapper">
        <InputField label="Numer telefonu">
          <Input
            icon={<FiPhone color="rgb(156 163 175)" size="20px" />}
            placeholder="Brak numeru telefonu"
            type="text"
            width={100}
            onChange={(e) => handleChange(e)}
            name="phoneNumber"
            value={hidePhoneNumber(userInfo.phoneNumber)}
            disabled={true}
          />
        </InputField>
        <InputField label="Lokalizacja">
          <SearchInput
            placeholder="Podaj tylko miasto"
            type="text"
            icon={<GrLocation color="rgb(156, 163, 175)" size={20} />}
            width={100}
            onCitySelect={handleChangeLocation}
            name="location"
            value={userInfo.location}
          />
        </InputField>
      </div>
      <div className="acc-settings-input-wrapper">
        <InputField label="Data Urodzenia">
          <Input
            type="date"
            icon={<FiCalendar color="rgb(156, 163, 175)" size={20} />}
            width={100}
            onChange={(e) => handleChange(e)}
            name="birthDate"
            value={userInfo.birthDate}
            error={errors.birthDate}
          />
        </InputField>
        <InputField label="Płeć">
          <Select
            icon={<FaTransgender color="rgb(156, 163, 175)" size={20} />}
            width={100}
            options={GENDERS}
            defaultValue="NotDisclosed"
            defaultText="Wolę nie podawać"
            onChange={(e) => handleChange(e)}
            name="gender"
            value={userInfo.gender}
          />
        </InputField>
      </div>
    </>
  );
};

export default PersonalInfo;
