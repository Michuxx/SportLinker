import Avatar from "../../component-items/avatar/Avatar";
import Button from "../../component-items/button/button";
import Tag from "../../component-items/tags/Tag";
import "./addPeopleCard.css";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

const AddPeopleCard = ({
  request,
  openSlots,
  rejectPlayerRequest,
  acceptPlayerRequest,
  requestAction = null,
  isSaving = false,
}) => {
  const isProcessing = requestAction && String(requestAction.userId) === String(request.id);
  const isBusy = Boolean(requestAction) || isSaving;
  return (
    <div className="add-people-card-container">
      <div className="add-people-user-wrapper">
        <Avatar image={request.image} size={3} />
        <p>{request.name}</p>
        {openSlots === 0 && <Tag styleType="overpopulation" />}
      </div>
      <div className="add-people-btn-wrapper">
        <Button
          onClick={() => acceptPlayerRequest(request)}
          Icon={<FaCheck size={20} />}
          style="acceptButton"
          disabled={isBusy || openSlots === 0}
        >
          {isProcessing && requestAction.action === "accept" ? "Akceptowanie..." : ""}
        </Button>
        <Button
          Icon={<MdClose size={20} />}
          onClick={() => rejectPlayerRequest(request.id)}
          style="rejectButton"
          disabled={isBusy}
        >
          {isProcessing && requestAction.action === "reject" ? "Odrzucanie..." : ""}
        </Button>
      </div>
    </div>
  );
};

export default AddPeopleCard;
