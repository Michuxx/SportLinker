import { useEffect, useState } from "react";
import sportService from "../api/sportService";

const useOfferSports = () => {
  const [state, setState] = useState({
    options: [],
    loading: true,
    error: false,
  });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, loading: true, error: false }));
    const load = async () => {
      try {
        const data = await sportService.getSports({
          signal: controller.signal,
        });
        if (!Array.isArray(data))
          throw new Error("Nieprawidłowa lista sportów.");
        if (!controller.signal.aborted)
          setState({
            options: data.map((sport) => ({
              value: String(sport.id),
              text: sport.name,
            })),
            loading: false,
            error: false,
          });
      } catch {
        if (!controller.signal.aborted)
          setState((previous) => ({
            ...previous,
            loading: false,
            error: true,
          }));
      }
    };
    load();
    return () => controller.abort();
  }, [version]);
  return { ...state, retry: () => setVersion((previous) => previous + 1) };
};

export default useOfferSports;
