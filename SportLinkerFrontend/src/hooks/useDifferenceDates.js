import { useMemo } from "react";

const useDifferenceDates = (dateISO) => {
  const formattedDate = useMemo(() => {
    if (!dateISO) return null;

    const dateObj = new Date(dateISO);
    const todaysDate = new Date();

    const diffInMs = todaysDate.getTime() - dateObj.getTime();
    const diffInDay = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDay;
  }, [dateISO]);

  return formattedDate + 1;
};

export default useDifferenceDates;
