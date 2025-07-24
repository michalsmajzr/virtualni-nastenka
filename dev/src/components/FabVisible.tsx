"use client";
import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { usePathname } from "next/navigation";

export const FabVisibleContext = createContext<{
  fabVisible: boolean;
  setFabVisible: Dispatch<SetStateAction<boolean>>;
}>({
  fabVisible: true,
  setFabVisible: () => {},
});

export default function FabVisible({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fabVisible, setFabVisible] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    setFabVisible(true);
  }, [pathname]);

  return (
    <FabVisibleContext
      value={{
        fabVisible,
        setFabVisible,
      }}
    >
      {children}
    </FabVisibleContext>
  );
}
