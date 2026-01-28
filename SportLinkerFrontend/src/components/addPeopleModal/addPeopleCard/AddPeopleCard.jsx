import Avatar from "../../component-items/avatar/Avatar";
import Button from "../../component-items/button/button";
import Tag from "../../component-items/tags/Tag";
import "./addPeopleCard.css";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

const AddPeopleCard = ({ request, openSlots }) => {
  console.log(openSlots);
  return (
    <div className="add-people-card-container">
      <div className="add-people-user-wrapper">
        <Avatar image={request.image} size={3} />
        <p>{request.name}</p>
        {openSlots === 0 && <Tag styleType="overpopulation" />}
      </div>
      <div className="add-people-btn-wrapper">
        <Button Icon={<FaCheck size={20} />} style="acceptButton" />
        <Button Icon={<MdClose size={20} />} style="rejectButton" />
      </div>
    </div>
  );
};

export default AddPeopleCard;
