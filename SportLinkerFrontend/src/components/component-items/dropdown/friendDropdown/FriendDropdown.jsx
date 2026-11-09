import { useState } from "react";
import {
  autoUpdate, flip, FloatingFocusManager, FloatingPortal, offset, shift,
  useClick, useDismiss, useFloating, useInteractions, useRole,
} from "@floating-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import { MdPersonRemove } from "react-icons/md";
import "../dropdown.css";
import "./friendDropdown.css";

const FriendDropdown = ({ name, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context, { ancestorScroll: true });
  const role = useRole(context, { role: "menu" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <div className="friend-dropdown-trigger" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className="popupSettingsButton"
        ref={refs.setReference}
        disabled={!onRemove}
        aria-label={`Opcje znajomego ${name}`}
        {...getReferenceProps()}
      >
        <HiDotsVertical size={18} aria-hidden="true" />
      </button>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className="dropdown-wrapper friend-dropdown"
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps({ onClick: (event) => event.stopPropagation() })}
            >
              <button type="button" role="menuitem" className="classicDropdownOptionButton" onClick={() => {
                setIsOpen(false);
                onRemove?.();
              }}>
                <MdPersonRemove size={22} aria-hidden="true" />
                Usuń znajomego
              </button>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
};

export default FriendDropdown;
