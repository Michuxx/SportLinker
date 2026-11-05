import { useEffect, useRef, useState } from "react";
import friendService from "../api/friendService";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../utils/apiErrorHelper";
import { applyFriendAction, prepareFriendAction } from "../utils/profileRelationship";

const successMessages = {
  send: "Zaproszenie do znajomych zostało wysłane.",
  accept: "Zaproszenie zostało zaakceptowane. Jesteście znajomymi!",
  reject: "Zaproszenie do znajomych zostało odrzucone.",
  cancel: "Zaproszenie do znajomych zostało anulowane.",
  delete: "Użytkownik został usunięty ze znajomych.",
};

const useFriendActions = ({ userId, viewerId, userInfo, setUserInfo }) => {
  const { showToast } = useToast();
  const controllerRef = useRef(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(false);
    return () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [userId, viewerId]);

  const handleAction = async (action) => {
    if (!viewerId || controllerRef.current || !userInfo) return;
    const body = prepareFriendAction(action, { ...userInfo, userId });
    if (!body) {
      showToast({ severity: "error", summary: "Nie udało się wykonać akcji", detail: "Dane zaproszenia są nieaktualne lub niepełne. Odśwież profil i spróbuj ponownie." });
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setIsPending(true);
    try {
      const result = await friendService[action](body, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setUserInfo((previous) => applyFriendAction(previous, action, result));
      showToast({ severity: "success", summary: "Znajomi", detail: successMessages[action] });
    } catch (error) {
      if (controller.signal.aborted) return;
      showToast({ severity: "error", summary: "Nie udało się wykonać akcji", detail: getErrorMessage(error, "Nie udało się zmienić relacji. Spróbuj ponownie.") });
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setIsPending(false);
      }
    }
  };

  return { isPending, handleAction };
};

export default useFriendActions;
