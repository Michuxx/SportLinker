import { useCallback, useEffect, useRef, useState } from "react";
import userService from "../api/userService";
import friendService from "../api/friendService";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../utils/apiErrorHelper";

const useFriendInvitations = (userId) => {
  const { showToast } = useToast();
  const [state, setState] = useState({ userId: null, items: [], loading: true, error: false });
  const [version, setVersion] = useState(0);
  const [pendingId, setPendingId] = useState(null);
  const actionController = useRef(null);

  useEffect(() => {
    setPendingId(null);
    return () => {
      actionController.current?.abort();
      actionController.current = null;
    };
  }, [userId]);

  useEffect(() => {
    const controller = new AbortController();
    setState({ userId, items: [], loading: Boolean(userId), error: false });
    if (!userId) return () => controller.abort();

    const load = async () => {
      try {
        const items = await userService.getFriendInvitations({ signal: controller.signal });
        if (!Array.isArray(items)) throw new Error("Nieprawidłowa odpowiedź serwera.");
        if (!controller.signal.aborted) setState({ userId, items, loading: false, error: false });
      } catch {
        if (!controller.signal.aborted) setState({ userId, items: [], loading: false, error: true });
      }
    };
    load();
    return () => controller.abort();
  }, [userId, version]);

  const isCurrent = state.userId === userId;
  const isLoading = Boolean(userId) && (!isCurrent || state.loading);
  const resolveInvitation = async (friendRequestId, action) => {
    if (!userId || !isCurrent || isLoading || actionController.current || !["accept", "reject"].includes(action)) return;
    if (!state.items.some((item) => item.friendRequestId === friendRequestId)) return;
    if (!Number.isInteger(friendRequestId) || friendRequestId <= 0) return;

    const controller = new AbortController();
    actionController.current = controller;
    setPendingId(friendRequestId);
    try {
      await friendService[action]({ friendRequestId }, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setState((previous) => previous.userId === userId ? {
        ...previous,
        items: previous.items.filter((item) => item.friendRequestId !== friendRequestId),
      } : previous);
      showToast({ severity: "success", summary: "Znajomi", detail: action === "accept" ? "Zaproszenie zostało zaakceptowane." : "Zaproszenie zostało odrzucone." });
    } catch (error) {
      if (!controller.signal.aborted) showToast({ severity: "error", summary: "Błąd", detail: getErrorMessage(error, "Nie udało się zmienić statusu zaproszenia. Spróbuj ponownie.") });
    } finally {
      if (actionController.current === controller) {
        actionController.current = null;
        setPendingId(null);
      }
    }
  };

  const reload = useCallback(() => setVersion((previous) => previous + 1), []);
  return { invitations: isCurrent ? state.items : [], isLoading, error: isCurrent && state.error, pendingId, resolveInvitation, reload };
};

export default useFriendInvitations;
