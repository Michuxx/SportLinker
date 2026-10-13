import React, { createContext, useContext, useRef, useEffect, useCallback } from "react";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "./toast.css";

const ToastContext = createContext(null);

export const showGlobalToast = (options) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app:toast", { detail: options }));
  }
};

export const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);

  const showToast = useCallback(
    ({ severity = "info", summary = "", detail = "", life = 3500 }) => {
      toastRef.current?.show({
        severity,
        summary,
        detail,
        life,
      });
    },
    [],
  );

  useEffect(() => {
    const handleEvent = (event) => {
      if (event.detail && toastRef.current) {
        toastRef.current.show({
          severity: "info",
          life: 3500,
          ...event.detail,
        });
      }
    };
    window.addEventListener("app:toast", handleEvent);
    return () => window.removeEventListener("app:toast", handleEvent);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toastRef }}>
      <Toast ref={toastRef} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: showGlobalToast,
      toastRef: { current: null },
    };
  }
  return context;
};

export default ToastContext;
