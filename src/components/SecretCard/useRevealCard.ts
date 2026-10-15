import { useEffect, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

export function useRevealCard() {
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState(false);
  const hide = () => setVisible(false);

  useEffect(() => {
    const conceal = () => setVisible(false);
    window.addEventListener("blur", conceal);
    document.addEventListener("visibilitychange", conceal);
    return () => {
      window.removeEventListener("blur", conceal);
      document.removeEventListener("visibilitychange", conceal);
    };
  }, []);

  function reveal() {
    setVisible(true);
    setSeen(true);
  }
  function press(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    reveal();
  }
  function keyPress(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      reveal();
    }
  }

  return { visible, seen, hide, press, keyPress };
}
