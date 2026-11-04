import { useCallback, useEffect, useState } from "react";
import userService from "../api/userService";
import { normalizeUserOffer, normalizeUserRequest, normalizeSentOfferRequest, normalizeJoinedOffer } from "../utils/userOfferLists";

const lists = {
  offers: {
    load: (userId, signal) => userService.getUserOffers(userId, { signal }),
    normalize: normalizeUserOffer,
  },
  requests: {
    load: (_userId, signal) => userService.getUserRequests({ signal }),
    normalize: normalizeUserRequest,
  },
  sent: {
    load: (_userId, signal) => userService.getSentOfferRequests({ signal }),
    normalize: normalizeSentOfferRequest,
  },
  joined: {
    load: (_userId, signal) => userService.getJoinedOffers({ signal }),
    normalize: normalizeJoinedOffer,
  },
};

const useUserOfferList = (userId, type = "offers") => {
  const [state, setState] = useState({ userId: null, type, items: [], loading: true, error: false });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ userId, type, items: [], loading: Boolean(userId), error: false });
    if (!userId) return () => controller.abort();

    const fetchList = async () => {
      try {
        const { load, normalize } = lists[type];
        const data = await load(userId, controller.signal);
        if (!controller.signal.aborted) {
          setState({ userId, type, items: data.map(normalize), loading: false, error: false });
        }
      } catch {
        if (!controller.signal.aborted) setState({ userId, type, items: [], loading: false, error: true });
      }
    };
    fetchList();
    return () => controller.abort();
  }, [userId, type, version]);

  const setItems = useCallback((update) => {
    setState((prev) => ({ ...prev, items: typeof update === "function" ? update(prev.items) : update }));
  }, []);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  const isCurrent = state.userId === userId && state.type === type;
  return {
    items: isCurrent ? state.items : [],
    isLoading: Boolean(userId) && (!isCurrent || state.loading),
    error: isCurrent && state.error,
    setItems,
    reload,
  };
};

export default useUserOfferList;
