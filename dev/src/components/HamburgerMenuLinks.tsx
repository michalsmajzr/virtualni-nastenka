"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { ReactSVG } from "react-svg";

export default function HamburgerMenuLinks() {
  const { data: session, status } = useSession();

  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const topMenuLinks = [
    {
      text: "Nastavení účtu",
      src: "/icons/account-circle.svg",
      onClick: () => router.push("/dashboard/account"),
    },
    {
      text: "Archiv",
      src: "/icons/home-storage.svg",
      onClick: () => router.push("/dashboard/archive"),
    },
  ];

  const bottomMenuLinks = [
    {
      text: "Přepnout režim",
      src: theme === "light" ? "/icons/dark-mode.svg" : "/icons/light-mode.svg",
      onClick: () => setTheme(theme === "light" ? "dark" : "light"),
    },
    {
      text: "Odhlásit se",
      src: "/icons/logout.svg",
      onClick: () => signOut(),
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between w-full">
      <div className="flex flex-col">
        {topMenuLinks
          .filter(
            (link) =>
              link.text !== "Archiv" ||
              (status === "authenticated" && session?.user?.role === "teacher")
          )
          .map((topMenuLink) => (
            <button
              key={topMenuLink.text}
              onClick={topMenuLink.onClick}
              className="group relative w-full cursor-pointer"
            >
              <span className="z-10 absolute inset-0 bg-primary opacity-0 group-hover:opacity-8 rounded-3xl"></span>
              <span className="flex items-center gap-3 p-4 rounded-2xl">
                <ReactSVG src={topMenuLink.src} />
                <span className="text-label-large font-medium leading-5 tracking-wide">
                  {topMenuLink.text}
                </span>
              </span>
            </button>
          ))}
      </div>

      <div>
        {bottomMenuLinks.map((bottomMenuLink) => (
          <button
            key={bottomMenuLink.text}
            onClick={bottomMenuLink.onClick}
            className="group relative w-full cursor-pointer"
          >
            <span className="z-10 absolute inset-0 bg-primary opacity-0 group-hover:opacity-8 rounded-3xl"></span>
            <span className="flex items-center gap-3 p-4 rounded-2xl">
              <ReactSVG src={bottomMenuLink.src} />
              <span className="text-label-large font-medium leading-5 tracking-wide">
                {bottomMenuLink.text}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
