import { useMemo } from "react";

const useAgeCalculate = (dateISO) => {
  const calculateAge = useMemo(() => {
    if (!dateISO) return null;

    var today = new Date();

    const birthDate = new Date(dateISO);

    var age = today.getFullYear() - birthDate.getFullYear();
    var month = today.getMonth - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [dateISO]);

  return calculateAge;
};

export default useAgeCalculate;
