import { useCallback, useEffect, useState } from "react";
import userService from "../api/userService";
import { normalizeUserOffer, normalizeUserRequest } from "../utils/userOfferLists";

const useUserOfferList = (userId, type = "offers") => {
  const [state, setState] = useState({ userId: null, items: [], loading: true, error: false });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ userId, items: [], loading: Boolean(userId), error: false });
    if (!userId) return () => controller.abort();

    const fetchList = async () => {
      try {
        const data = type === "requests"
          ? await userService.getUserRequests({ signal: controller.signal })
          : await userService.getUserOffers(userId, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setState({ userId, items: data.map(type === "requests" ? normalizeUserRequest : normalizeUserOffer), loading: false, error: false });
        }
      } catch {
        if (!controller.signal.aborted) setState({ userId, items: [], loading: false, error: true });
      }
    };
    fetchList();
    return () => controller.abort();
  }, [userId, type, version]);

  const setItems = useCallback((update) => {
    setState((prev) => ({ ...prev, items: typeof update === "function" ? update(prev.items) : update }));
  }, []);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  const isCurrent = state.userId === userId;
  return {
    items: isCurrent ? state.items : [],
    isLoading: Boolean(userId) && (!isCurrent || state.loading),
    error: isCurrent && state.error,
    setItems,
    reload,
  };
};

export default useUserOfferList;
