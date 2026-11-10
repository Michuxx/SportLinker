import { useState } from "react";
import {
  autoUpdate, flip, FloatingFocusManager, FloatingPortal, offset, shift,
  useClick, useDismiss, useFloating, useInteractions, useRole,
} from "@floating-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import "../../../component-items/dropdown/dropdown.css";
import "./conversationActions.css";

const ConversationActions = ({ onDelete, disabled }) => {
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
    <>
      <button type="button" className="popupSettingsButton" ref={refs.setReference} disabled={disabled} aria-label="Opcje konwersacji" {...getReferenceProps()}>
        <HiDotsVertical size={22} aria-hidden="true" />
      </button>
      {isOpen && <FloatingPortal>
        <FloatingFocusManager context={context} modal={false}>
          <div className="dropdown-wrapper conversation-actions-dropdown" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <button type="button" role="menuitem" className="logoutDropdownOptionButton" disabled={disabled} onClick={() => {
              setIsOpen(false);
              onDelete();
            }}>
              <FiTrash2 size={18} aria-hidden="true" />Usuń konwersację
            </button>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>}
    </>
  );
};

export default ConversationActions;
