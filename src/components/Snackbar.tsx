"use client";
import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { ReactSVG } from "react-svg";
import { usePathname } from "next/navigation";

export const SnackbarContext = createContext<{
  snackbar: string;
  setSnackbar: Dispatch<SetStateAction<string>>;
  isResetSnackbar: boolean;
  setIsResetSnackbar: Dispatch<SetStateAction<boolean>>;
}>({
  snackbar: "",
  setSnackbar: () => {},
  isResetSnackbar: false,
  setIsResetSnackbar: () => {},
});

export default function Snackbar({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState("");
  const [isResetSnackbar, setIsResetSnackbar] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    function timeoutSnackbar() {
      setSnackbar("");
    }

    if (isResetSnackbar) {
      setSnackbar("");
    } else {
      setIsResetSnackbar(true);
    }

    const timeout = setTimeout(timeoutSnackbar, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <SnackbarContext
      value={{
        snackbar,
        setSnackbar,
        isResetSnackbar,
        setIsResetSnackbar,
      }}
    >
      {snackbar && (
        <div className="z-100 w-full fixed left-0 flex justify-center">
          <div className="fixed bottom-6 min-h-12 flex items-center bg-inverse-surface text-inverse-on-surface text-body-medium leading-5 tracking-wide shadow-level3 rounded">
            <span className="px-4">{snackbar}</span>
            <ReactSVG
              src="/icons/close.svg"
              onClick={() => setSnackbar("")}
              className="px-3 cursor-pointer"
            />
          </div>
        </div>
      )}
      {children}
    </SnackbarContext>
  );
}
