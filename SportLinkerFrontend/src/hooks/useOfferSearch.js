import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useAuth from "./useAuth";
import offerService from "../api/offerService";
import { getErrorMessage } from "../utils/apiErrorHelper";
import {
  INITIAL_OFFER_FILTER,
  prepareOfferSearch,
  normalizeSearchOffer,
  mergeOfferPages,
  matchesOfferSearch,
} from "../utils/offerSearch";

const useOfferSearch = () => {
  const { user } = useAuth();
  const viewerId = user?.id ?? null;
  const [filter, setFilter] = useState(INITIAL_OFFER_FILTER);
  const [appliedFilter, setAppliedFilter] = useState(INITIAL_OFFER_FILTER);
  const [errors, setErrors] = useState({});
  const [searchVersion, setSearchVersion] = useState(0);
  const prepared = useMemo(
    () => prepareOfferSearch(appliedFilter),
    [appliedFilter],
  );
  const invalid = Object.keys(prepared.errors).length > 0;
  const paramsKey = JSON.stringify(prepared.params);
  const key = JSON.stringify([viewerId, paramsKey, searchVersion]);
  const [state, setState] = useState({
    key: null,
    items: [],
    loading: true,
    error: null,
    hasMore: false,
  });
  const [created, setCreated] = useState({ viewerId: null, items: [] });
  const sessionRef = useRef(null);

  const loadPage = useCallback(async (session) => {
    if (
      session.loading ||
      session.controller.signal.aborted ||
      !session.hasMore
    )
      return;
    session.loading = true;
    session.error = false;
    setState((previous) => ({ ...previous, loading: true, error: null }));
    try {
      const data = await offerService.searchOffers(
        { ...session.params, page: session.page, pageSize: 12 },
        { signal: session.controller.signal },
      );
      if (
        !Array.isArray(data.items) ||
        !Number.isInteger(data.totalCount) ||
        data.page !== session.page ||
        !Number.isInteger(data.pageSize) ||
        data.pageSize <= 0
      )
        throw new Error("Nieprawidłowa strona ofert.");
      if (session.controller.signal.aborted) return;
      session.hasMore =
        data.items.length > 0 && data.page * data.pageSize < data.totalCount;
      session.page += 1;
      setState((previous) =>
        previous.key === session.key
          ? {
              key: session.key,
              items: mergeOfferPages(
                previous.items,
                data.items.map(normalizeSearchOffer),
              ),
              loading: false,
              error: null,
              hasMore: session.hasMore,
            }
          : previous,
      );
    } catch (error) {
      if (!session.controller.signal.aborted) {
        session.error = true;
        setState((previous) =>
          previous.key === session.key
            ? {
                ...previous,
                loading: false,
                error: getErrorMessage(
                  error,
                  "Nie udało się pobrać ofert. Spróbuj ponownie.",
                ),
              }
            : previous,
        );
      }
    } finally {
      session.loading = false;
    }
  }, []);

  useEffect(() => {
    const session = {
      key,
      params: JSON.parse(paramsKey),
      page: 1,
      hasMore: true,
      loading: false,
      error: false,
      controller: new AbortController(),
    };
    sessionRef.current = session;
    setState({
      key,
      items: [],
      loading: !invalid,
      error: null,
      hasMore: false,
    });
    const timer = !invalid ? setTimeout(() => loadPage(session), 0) : null;
    return () => {
      clearTimeout(timer);
      session.controller.abort();
    };
  }, [key, paramsKey, invalid, loadPage]);

  const current = state.key === key;
  const offers =
    current && !invalid
      ? mergeOfferPages(
          created.viewerId === viewerId
            ? created.items.filter((offer) =>
                matchesOfferSearch(offer, prepared.params),
              )
            : [],
          state.items,
        )
      : [];
  const loadMore = useCallback(() => {
    const session = sessionRef.current;
    if (session?.key === key && !session.error && !invalid)
      return loadPage(session);
  }, [key, invalid, loadPage]);
  const retry = () => {
    const session = sessionRef.current;
    if (session?.key === key && !invalid) return loadPage(session);
  };

  return {
    filter,
    setFilter: (update) => {
      setFilter(update);
      setErrors({});
    },
    offers,
    errors,
    submitSearch: () => {
      const result = prepareOfferSearch(filter);
      setErrors(result.errors);
      if (Object.keys(result.errors).length > 0) return;
      setAppliedFilter(filter);
      setSearchVersion((previous) => previous + 1);
    },
    isLoading: !invalid && (!current || state.loading),
    error: current ? state.error : null,
    hasMore: current && state.hasMore && !invalid,
    loadMore,
    retry,
    addOffer: (offer) =>
      setCreated((previous) => ({
        viewerId,
        items: mergeOfferPages(
          [offer],
          previous.viewerId === viewerId ? previous.items : [],
        ),
      })),
  };
};

export default useOfferSearch;
