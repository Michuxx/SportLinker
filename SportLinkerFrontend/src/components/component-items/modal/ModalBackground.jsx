import Button from "../button/button";
import "./modalBackground.css";
import { MdClose } from "react-icons/md";

const ModalBackground = ({ children, closeModal }) => {
  return (
    <div className="modal-background-wrapper">
      <div className="modal-background">
        <Button
          style="modalCloseButton"
          onClick={closeModal}
          Icon={<MdClose className="close-icon" />}
        ></Button>
        {children}
      </div>
    </div>
  );
};

export default ModalBackground;
