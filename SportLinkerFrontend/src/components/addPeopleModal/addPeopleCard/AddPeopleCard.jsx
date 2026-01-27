import Avatar from "../../component-items/avatar/Avatar";
import Button from "../../component-items/button/button";
import "./addPeopleCard.css";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

const AddPeopleCard = ({ request }) => {
  return (
    <div className="add-people-card-container">
      <div className="add-people-user-wrapper">
        <Avatar image={request.image} size={3} />
        <p>{request.name}</p>
      </div>
      <div className="add-people-btn-wrapper">
        <Button Icon={<FaCheck size={20} />} style="acceptButton" />
        <Button Icon={<MdClose size={20} />} style="rejectButton" />
      </div>
    </div>
  );
};

export default AddPeopleCard;
