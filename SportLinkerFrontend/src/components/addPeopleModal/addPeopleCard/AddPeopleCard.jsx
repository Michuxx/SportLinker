import Avatar from "../../component-items/avatar/Avatar";
import Button from "../../component-items/button/button";
import "./addPeopleCard.css";

const AddPeopleCard = ({ request }) => {
  return (
    <div className="add-people-card-container">
      <Avatar image={request.image} size={3} />
      <p>{request.name}</p>
      <div className="add-people-btn-wrapper">
        <Button />
        <Button />
      </div>
    </div>
  );
};

export default AddPeopleCard;
