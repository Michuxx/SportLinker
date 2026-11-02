import { useEffect, useRef, useState } from "react";
import OfferStatusCard from "./offerStatusCard/OfferStatusCard";
import NullStatuses from "./nullStatuses/nullStatuses";
import ModalBackground from "../../../component-items/modal/ModalBackground";
import WarningModal from "../../../warningModal/WarningModal";
import NullComponent from "../../../component-items/nullComponent/NullComponent";
import Button from "../../../component-items/button/button";
import { BsDoorOpenFill } from "react-icons/bs";
import useAuth from "../../../../hooks/useAuth";
import useUserOfferList from "../../../../hooks/useUserOfferList";
import offerService from "../../../../api/offerService";
import { useToast } from "../../../../context/ToastContext";
import { getErrorMessage } from "../../../../utils/apiErrorHelper";

const OfferStatuses = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { items: statuses, setItems: setStatuses, isLoading, error, reload } = useUserOfferList(user?.id, "sent");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const controllerRef = useRef(null);

  useEffect(() => {
    setSelectedRequest(null);
    setIsProcessing(false);
    return () => controllerRef.current?.abort();
  }, [user?.id]);

  const handleRemoveRequest = async (request) => {
    if (!request || controllerRef.current || isLoading) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsProcessing(true);
    const previousIndex = statuses.findIndex((item) => item.id === request.id);
    setStatuses((items) => items.filter((item) => item.id !== request.id));
    const isRejected = request.status === "rejected";
    try {
      if (isRejected) {
        await offerService.deleteRejectedRequest(request.offerId, { signal: controller.signal });
      } else {
        await offerService.cancelOfferRequest(request.offerId, { signal: controller.signal });
      }
      if (!controller.signal.aborted) showToast({ severity: "success", summary: "Sukces", detail: isRejected ? "Odrzucona prośba została usunięta." : "Prośba została anulowana." });
    } catch (err) {
      if (!controller.signal.aborted) {
        setStatuses((items) => {
          if (items.some((item) => item.id === request.id)) return items;
          const restored = [...items];
          restored.splice(previousIndex, 0, request);
          return restored;
        });
        showToast({ severity: "error", summary: "Błąd", detail: getErrorMessage(err, isRejected ? "Nie udało się usunąć prośby." : "Nie udało się anulować prośby.") });
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      if (!controller.signal.aborted) setIsProcessing(false);
    }
  };

  if (!user?.id) return <NullComponent icon="🔒" title="Zaloguj się" text="Zaloguj się, aby zobaczyć wysłane prośby." />;
  return (
    <div className="user-offer-statuses-wrapper">
      {isLoading ? <p role="status">Ładowanie wysłanych próśb...</p> : error ? (
        <div role="alert">
          <NullComponent icon="📨" title="Nie udało się pobrać próśb" text="Sprawdź połączenie i spróbuj ponownie.">
            <Button style="gradientButton" onClick={reload}>Spróbuj ponownie</Button>
          </NullComponent>
        </div>
      ) : statuses.length > 0 ? statuses.map((request) => (
        <OfferStatusCard offerApplication={request} key={request.id} isBusy={isProcessing}
          handleResignApplication={() => request.status === "rejected"
            ? handleRemoveRequest(request)
            : setSelectedRequest(request)} />
      )) : <NullStatuses />}
      {selectedRequest && (
        <ModalBackground closeModal={() => setSelectedRequest(null)}>
          <WarningModal
            headline={selectedRequest.status === "rejected" ? "Czy na pewno chcesz usunąć odrzuconą prośbę?" : "Czy na pewno chcesz anulować prośbę o dołączenie?"}
            confirmText="Tak, chcę" confirmIcon={<BsDoorOpenFill size={20} />}
            onCancel={() => setSelectedRequest(null)}
            onConfirm={() => handleRemoveRequest(selectedRequest)} />
        </ModalBackground>
      )}
    </div>
  );
};

export default OfferStatuses;
