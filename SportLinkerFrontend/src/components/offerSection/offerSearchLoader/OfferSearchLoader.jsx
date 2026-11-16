import { useEffect, useRef } from "react";

const OfferSearchLoader = ({ enabled, onLoadMore }) => {
  const elementRef = useRef(null);
  useEffect(() => {
    if (!enabled || !elementRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
    }, { rootMargin: "0px 0px 300px 0px" });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [enabled, onLoadMore]);
  return <div ref={elementRef} className="offer-search-sentinel" aria-hidden="true" />;
};

export default OfferSearchLoader;
