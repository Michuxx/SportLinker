import "./userHeader.css";
import { LuUser } from "react-icons/lu";
import { FiMail } from "react-icons/fi";
import Button from "../../../../component-items/button/button";
import { FaRegAddressCard } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { FiSave } from "react-icons/fi";
import EditInput from "../../../../component-items/input/EditInput";
import InputField from "../../../../component-items/inputField/InputField";

const UserHeader = ({
  name,
  email,
  isEditing,
  setIsEditing,
  editData,
  cancelHandle,
  onChange,
  handleSave,
  error,
}) => {
  return (
    <div className="user-header-wrapper">
      <div className="user-header-info-wrapper">
        <div className="user-header-detailed-wrapper">
          <div className="user-header-avatar">
            <LuUser size={36} color="white" />
          </div>
          <div className="user-header-info">
            {isEditing ? (
              <InputField>
                <EditInput
                  value={editData.name}
                  size={2}
                  type="text"
                  name="name"
                  width={70}
                  onChange={(e) => onChange(e)}
                  error={error.name}
                />
              </InputField>
            ) : (
              <h1>{name}</h1>
            )}
            <div className="user-header-email">
              {isEditing ? (
                <InputField>
                  <EditInput
                    value={editData.email}
                    size={1}
                    type="email"
                    name="email"
                    width={69}
                    onChange={(e) => onChange(e)}
                    error={error.email}
                    icon={<FiMail color="rgb(75 85 99)" size={16} />}
                  />
                </InputField>
              ) : (
                <div className="user-header-email-wrapper">
                  <FiMail color="rgb(75 85 99)" />
                  <p>{email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="user-header-btn-wrapper">
          {isEditing ? (
            <div className="user-btn-edit-wrapper">
              <Button
                style="classicGreenButton"
                Icon={<FiSave size={20} />}
                onClick={handleSave}
              >
                Zapisz
              </Button>
              <Button
                style="classicGreyButton"
                Icon={<MdClose size={20} />}
                onClick={cancelHandle}
              >
                Anuluj
              </Button>
            </div>
          ) : (
            <Button
              onClick={setIsEditing}
              style="classicBlueButton"
              Icon={<FaRegAddressCard size={16} />}
            >
              Edytuj
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
