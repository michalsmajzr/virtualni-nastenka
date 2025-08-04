import { useEffect } from "react";
import { clsx } from "clsx";

export default function Dialog({
  isOpen,
  close,
  children,
}: {
  isOpen: boolean;
  close: () => void;
  children?: React.ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    }
    window.addEventListener("keydown", handleEsc, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div
      onClick={close}
      className={clsx(
        "z-50 fixed items-center justify-center top-0 left-0 h-full w-full bg-neutral-variant",
        isOpen ? "flex" : "hidden"
      )}
    >
      {children}
    </div>
  );
}
