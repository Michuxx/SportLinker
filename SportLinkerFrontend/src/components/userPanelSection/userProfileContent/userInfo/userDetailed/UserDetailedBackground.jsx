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
}) => {
  return (
    <div className="user-detailed-background">
      <div className="title-btn-wrapper">
        <h3>{title}</h3>
        {setEditing && (
          <>
            {isEditing ? (
              <div className="user-detailed-btn-wrapper">
                <Button
                  Icon={<FiSave size={22} />}
                  style="classicGreenButton"
                  onClick={saveEdit}
                />
                <Button
                  Icon={<MdClose size={22} />}
                  style="classicGreyButton"
                  onClick={cancelEdit}
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
      </div>
      {children}
    </div>
  );
};

export default UserDetailedBackground;
