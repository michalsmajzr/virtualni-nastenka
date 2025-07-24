"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import Badge from "@/components/Badge";
import { clsx } from "clsx";

/* dle oficiální dokumentace https://nextjs.org/learn/dashboard-app/navigating-between-pages" */

export default function SideNavLinks() {
  const { data: session, status } = useSession();

  const pathname = usePathname();

  const { setSnackbar } = useContext(SnackbarContext);

  const [badges, setBadges] = useState<{
    board: number;
    conversation: number;
    poll: number;
  }>({ board: 0, conversation: 0, poll: 0 });

  async function loadBadges() {
    const res = await fetch("/api/badge");

    if (res.ok) {
      const data = await res.json();
      const { badges } = data;
      setBadges(badges);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadBadges();
  }, [pathname]);

  const links = [
    {
      text: "Nástěnky",
      href: "/dashboard",
      src: "/icons/home.svg",
      srcFill: "/icons/home-fill.svg",
      badgeCount: badges.board,
    },
    {
      text: "Dotazy",
      href: "/dashboard/conversations",
      src: "/icons/chat.svg",
      srcFill: "/icons/chat-fill.svg",
      badgeCount: badges.conversation,
    },
    {
      text: "Ankety",
      href: "/dashboard/polls",
      src: "/icons/ballot.svg",
      srcFill: "/icons/ballot-fill.svg",
      badgeCount: badges.poll,
    },
    {
      text: "Správce",
      href: "/dashboard/administration",
      src: "/icons/admin-panel-settings.svg",
      srcFill: "/icons/admin-panel-settings-fill.svg",
      badgeCount: 0,
    },
  ];

  return (
    <>
      {links
        .filter(
          (link) =>
            link.href !== "/dashboard/administration" ||
            (status === "authenticated" && session?.user?.role === "teacher")
        )
        .map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="relative flex justify-center items-center min-h-8 min-w-14 mx-3 mb-1">
                <div
                  className={clsx(
                    "z-0 absolute inset-0 rounded-2xl",
                    {
                      "group-hover:bg-on-surface group-hover:opacity-8 group-active:opacity-10":
                        pathname !== link.href,
                    },
                    {
                      "bg-secondary-container": pathname === link.href,
                    }
                  )}
                ></div>
                <div className="relative">
                  {pathname !== link.href && (
                    <div className="z-50 absolute -top-0.5 left-3">
                      <Badge count={link.badgeCount} />
                    </div>
                  )}
                  <ReactSVG
                    src={pathname === link.href ? link.srcFill : link.src}
                    className={clsx(
                      "z-10 group-hover:scale-105 group-hover:text-on-surface group-active:scale-95 transition-all duration-100",
                      {
                        "text-on-surface-variant": pathname !== link.href,
                      },
                      {
                        "text-on-secondary-container font-bold":
                          pathname === link.href,
                      }
                    )}
                  />
                </div>
              </div>
              <span
                className={clsx(
                  "min-h-5 mx-3 text-label-medium font-medium leading-4 tracking-wider",
                  "group-hover:text-on-surface group-active:text-on-surface group-active:font-normal transition-all duration-100",
                  {
                    "text-on-surface-variant": pathname !== link.href,
                  },
                  {
                    "text-on-secondary-container font-bold":
                      pathname === link.href,
                  }
                )}
              >
                {link.text}
              </span>
            </Link>
          </li>
        ))}
    </>
  );
}
