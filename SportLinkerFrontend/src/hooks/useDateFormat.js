import { useMemo } from "react";

const useDateFormat = (dateISO) => {
  const formattedDate = useMemo(() => {
    if (!dateISO) return null;

    const dateObj = new Date(dateISO);

    if (isNaN(dateObj.getTime())) {
      return { date: "", time: "", weekday: "Błędna data" };
    }

    const weekday = new Intl.DateTimeFormat("pl-PL", {
      weekday: "long",
    }).format(dateObj);

    const datePart = new Intl.DateTimeFormat("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);
    const timePart = dateISO.split("T")[1]?.substring(0, 5);

    return {
      date: datePart,
      time: timePart,
      weekday: weekday,
    };
  }, [dateISO]);

  return formattedDate;
};

export default useDateFormat;
