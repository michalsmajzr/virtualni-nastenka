"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import IconButton from "@/components/IconButton";

export default function TopBarLinks() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const links = [
    {
      src:
        theme === "light"
          ? "/icons/dark-mode-36dp.svg"
          : "/icons/light-mode-36dp.svg",
      onClick: () => setTheme(theme === "light" ? "dark" : "light"),
      padding: 1,
    },
    {
      src: "/icons/home-storage-36dp.svg",
      onClick: () => router.push("/dashboard/archive"),
      padding: 1,
    },
    {
      src: "/icons/account-circle-36dp.svg",
      onClick: () => router.push("/dashboard/account"),
      padding: 1,
    },
    {
      src: "/icons/logout-36dp.svg",
      onClick: () => signOut(),
      padding: 1,
    },
  ];

  return (
    <>
      {links
        .filter(
          (link) =>
            link.src !== "/icons/home-storage-36dp.svg" ||
            (status === "authenticated" && session?.user?.role === "teacher")
        )
        .map((link) => (
          <IconButton
            key={link.src}
            src={link.src}
            onClick={link.onClick}
            size="small"
            className="hidden sm:inline-block"
          />
        ))}
    </>
  );
}
