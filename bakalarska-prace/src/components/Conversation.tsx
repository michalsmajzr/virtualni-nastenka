"use client";
import { ReactSVG } from "react-svg";
import { clsx } from "clsx";
import Image from "next/image";
import Badge from "@/components/Badge";

export default function Conversation({
  src,
  firstname,
  surname,
  message,
  time,
  onClick,
  active = false,
  badgeCount,
}: {
  src?: string;
  firstname: string;
  surname: string;
  message?: string;
  time?: string;
  onClick?: () => void;
  active?: boolean;
  badgeCount?: number;
}) {
  return (
    <>
      <div
        onClick={onClick}
        className={clsx(
          "group relative p-4 flex gap-3 cursor-pointer rounded-xl",
          { "bg-surface-container-highest": active }
        )}
      >
        <div className="z-10 absolute inset-0 bg-on-surface opacity-0 group-hover:opacity-10 rounded-xl"></div>
        <div className="flex items-center justify-center">
          {src ? (
            <Image
              src={src}
              width={36}
              height={36}
              style={{
                objectFit: "cover",
              }}
              alt={`${firstname} ${surname}`}
              className="h-9 w-9 text-on-surface-variant rounded-full"
            />
          ) : (
            <ReactSVG
              src="/icons/account-circle-40dp.svg"
              className="flex items-center justify-center text-on-surface-variant rounded-full"
            />
          )}
        </div>

        <div className="flex-1 flex justify-between overflow-hidden">
          <div className="overflow-hidden flex flex-col">
            <span className="text-body-large font-medium tracking-wide leading-6 truncate">
              {firstname} {surname}
            </span>
            <span className="truncate text-body-medium tracking-wide leading-5">
              {message}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="px-2 text-nowrap text-on-surface-variant text-label-small">
              {time}
            </span>
            <Badge count={badgeCount} />
          </div>
        </div>
      </div>
    </>
  );
}
