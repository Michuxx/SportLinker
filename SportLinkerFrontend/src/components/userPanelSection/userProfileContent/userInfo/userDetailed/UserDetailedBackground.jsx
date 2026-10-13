import "./userDetailed.css";
import Button from "../../../../component-items/button/button";
import { BiEditAlt } from "react-icons/bi";
import { FiSave } from "react-icons/fi";
import { MdClose } from "react-icons/md";

const UserDetailedBackground = ({
  title,
  children,
  setEditing,
  isEditing,
  cancelEdit,
  saveEdit,
  saveEdited,
  isSaving = false,
}) => {
  const saveIcon = isSaving ? (
    <span className="save-btn-spinner" />
  ) : (
    <FiSave size={22} />
  );

  return (
    <div className="user-detailed-background">
      <div className="title-btn-wrapper">
        <h3>{title}</h3>
        {setEditing && (
          <>
            {isEditing ? (
              <div className="user-detailed-btn-wrapper">
                <Button
                  Icon={saveIcon}
                  style="classicGreenButton"
                  onClick={isSaving ? undefined : saveEdit}
                />
                <Button
                  Icon={<MdClose size={22} />}
                  style="classicGreyButton"
                  onClick={isSaving ? undefined : cancelEdit}
                />
              </div>
            ) : (
              <Button
                Icon={<BiEditAlt size={22} />}
                style="classicBlueButton"
                onClick={setEditing}
              />
            )}
          </>
        )}
        {saveEdited && (
          <Button
            Icon={saveIcon}
            style={"gradientButton"}
            onClick={isSaving ? undefined : saveEdited}
          >
            Zapisz
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};

export default UserDetailedBackground;
