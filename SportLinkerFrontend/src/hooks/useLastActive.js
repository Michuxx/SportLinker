import { useEffect, useState } from "react";
import { formatLastActive } from "../utils/lastActive";

const useLastActive = (dateISO) => {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (!dateISO) return;
    const update = () => setNow(Date.now());
    update();
    const timer = setInterval(update, 30_000);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [dateISO]);

  return formatLastActive(dateISO, now);
};

export default useLastActive;
