"use client";
import { clsx } from "clsx";
import Badge from "@/components/Badge";

export default function BulkMessage({
  name,
  time,
  onClick,
  active = false,
  badgeType,
}: {
  name: string;
  time: string;
  onClick?: () => void;
  active?: boolean;
  badgeType?: "small" | "large";
}) {
  return (
    <>
      <div
        onClick={onClick}
        className={clsx(
          "group relative p-4 flex gap-3 cursor-pointer rounded-xl lg:w-80",
          { "bg-surface-container-highest": active }
        )}
      >
        <div className="z-10 absolute inset-0 bg-on-surface opacity-0 group-hover:opacity-10 rounded-xl"></div>
        <div className="flex-1 flex justify-between overflow-hidden">
          <div className="overflow-hidden flex flex-col">
            <span className="text-body-large font-medium tracking-wide leading-6 truncate">
              {name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 text-nowrap text-on-surface-variant text-label-small">
              {time}
            </span>
            {badgeType && <Badge type={badgeType} />}
          </div>
        </div>
      </div>
    </>
  );
}
