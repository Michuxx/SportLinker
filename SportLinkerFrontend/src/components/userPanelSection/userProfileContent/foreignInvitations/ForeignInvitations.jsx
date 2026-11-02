import { useEffect, useRef, useState } from "react";
import InvitationCard from "./invitationCard/InvitationCard";
import NullInvitations from "./nullInvitations/NullInvitations";
import NullComponent from "../../../component-items/nullComponent/NullComponent";
import Button from "../../../component-items/button/button";
import useAuth from "../../../../hooks/useAuth";
import useUserOfferList from "../../../../hooks/useUserOfferList";
import offerService from "../../../../api/offerService";
import { useToast } from "../../../../context/ToastContext";
import { getErrorMessage } from "../../../../utils/apiErrorHelper";
import { applyUserRequestDecision, rollbackUserRequestDecision } from "../../../../utils/userOfferLists";

const ForeignInvitations = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { items: invitations, setItems: setInvitations, isLoading, error, reload } = useUserOfferList(user?.id, "requests");
  const controllerRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsProcessing(false);
    return () => controllerRef.current?.abort();
  }, [user?.id]);

  const resolveRequest = async (requestId, action) => {
    if (controllerRef.current || isLoading) return;
    const request = invitations.find((item) => item.id === requestId);
    if (!request || request.status !== "pending") return;
    if (action === "accept" && request.currentPeople >= request.maxPeople) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    setIsProcessing(true);
    const previous = invitations;
    setInvitations((items) => applyUserRequestDecision(items, requestId, action));
    try {
      if (action === "accept") {
        await offerService.acceptOfferRequest(request.offerId, request.user.id, { signal: controller.signal });
      } else {
        await offerService.rejectOfferRequest(request.offerId, request.user.id, { signal: controller.signal });
      }
      if (!controller.signal.aborted) showToast({ severity: "success", summary: "Sukces", detail: action === "accept" ? "Prośba została zaakceptowana." : "Prośba została odrzucona." });
    } catch (err) {
      if (!controller.signal.aborted) {
        setInvitations((items) => rollbackUserRequestDecision(items, previous, requestId, action));
        showToast({ severity: "error", summary: "Błąd", detail: getErrorMessage(err, "Nie udało się zmienić statusu prośby.") });
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      if (!controller.signal.aborted) setIsProcessing(false);
    }
  };

  if (!user?.id) return <NullComponent icon="🔒" title="Zaloguj się" text="Zaloguj się, aby zobaczyć prośby do swoich ofert." />;
  return (
    <div className="user-invitations-wrapper">
      {isLoading ? <p role="status">Ładowanie próśb...</p> : error ? (
        <div role="alert">
          <NullComponent icon="📨" title="Nie udało się pobrać próśb" text="Sprawdź połączenie i spróbuj ponownie.">
            <Button style="gradientButton" onClick={reload}>Spróbuj ponownie</Button>
          </NullComponent>
        </div>
      ) : invitations.length > 0 ? invitations.map((invitation) => (
        <InvitationCard invitation={invitation} key={invitation.id} isBusy={isProcessing}
          handleAccept={(requestId) => resolveRequest(requestId, "accept")}
          handleReject={(requestId) => resolveRequest(requestId, "reject")} />
      )) : <NullInvitations />}
    </div>
  );
};

export default ForeignInvitations;
