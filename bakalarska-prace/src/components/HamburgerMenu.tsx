import { useEffect } from "react";
import { clsx } from "clsx";
import IconButton from "./IconButton";

export default function HamburgerMenu({
  isOpen,
  close,
  children,
}: {
  isOpen: boolean;
  close: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
  children?: React.ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <div
      className={clsx(
        "z-50 fixed top-0 left-0 items-center justify-end h-full w-full",
        isOpen ? "flex" : "hidden"
      )}
    >
      <div
        onClick={close}
        className={clsx(
          "absolute inset-0 bg-scrim transition-all duration-300 ease-in-out",
          isOpen ? "opacity-32" : "opacity-0"
        )}
      ></div>
      <section
        className={clsx(
          "flex flex-col items-end w-2xs h-full px-3 py-3 bg-surface-container-low rounded-l-xl transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <IconButton
          src="/icons/close.svg"
          size="medium"
          onClick={close}
          className="z-50"
        />
        {children}
      </section>
    </div>
  );
}
