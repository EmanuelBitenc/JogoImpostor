import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import s from "./ConfirmDialog.module.css";
import u from "../../styles/shared.module.css";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  returnFocusRef,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const returnTarget = returnFocusRef.current;
    cancelRef.current?.focus();
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("keydown", escape);
      if (returnTarget?.isConnected) returnTarget.focus();
    };
  }, [open, onCancel, returnFocusRef]);

  // The portal keeps the fixed overlay outside the animated screen's transform.
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className={s.backdrop} onClick={onCancel}>
      <section
        className={s.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const buttons = [...event.currentTarget.querySelectorAll("button")];
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <span className={u.eyebrow}>ÚLTIMA CHANCE DE BLEFAR</span>
        <h2 id="dialog-title">O grupo já terminou?</h2>
        <p>
          Isso vai mostrar os impostores e a palavra secreta para todo mundo.
        </p>
        <button className={u.primary} data-primary onClick={onConfirm}>
          Sim, revelar o segredo ↗
        </button>
        <button ref={cancelRef} className={u.secondary} onClick={onCancel}>
          Continuar jogando
        </button>
      </section>
    </div>,
    document.body,
  );
}
