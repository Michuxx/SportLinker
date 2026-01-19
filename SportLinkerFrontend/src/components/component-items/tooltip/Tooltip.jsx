import { useState } from "react";
import "./tooltip.css";

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useInteractions,
  FloatingPortal,
  useRole,
  useTransitionStyles
} from "@floating-ui/react";

const Tooltip = ({
  tooltipDirection,
  tooltipText,
  tooltipIcon,
}) => {

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  

  const { refs, floatingStyles, context } = useFloating({
    open: isTooltipOpen,
    onOpenChange: setIsTooltipOpen,
    placement: tooltipDirection,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8), 
      flip(),   
      shift(),  
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    role
  ]);

  return (
    <>
        {tooltipIcon && (
            <div
            ref={refs.setReference}
            {...getReferenceProps()}
            className="tooltip-trigger"
            style={{ display: "inline-flex" }}
          >
            {tooltipIcon}
          </div>
        )}
        {isTooltipOpen && tooltipText && (
              <FloatingPortal>
                <div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
                  className="custom-tooltip"
                >
                  {tooltipText}
                </div>
              </FloatingPortal>
            )}
      </>
  );
};

export default Tooltip;
