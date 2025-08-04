"use client";
import { ReactSVG } from "react-svg";
import Link from "next/link";

export default function Navigation({
  boardName,
  sectionName,
  boardId,
  sectionId,
}: {
  boardName?: string;
  sectionName?: string;
  boardId?: string;
  sectionId?: string;
}) {
  return (
    <div className="hidden mb-6 lg:flex lg:flex-wrap lg:items-end">
      <Link
        href={`/dashboard`}
        className="text-display-medium mb-1 hover:text-on-surface-variant lg:text-display-large"
      >
        Nástěnky
      </Link>
      {boardName && (
        <div className="flex text-display-small lg:text-display-medium">
          <ReactSVG
            src="/icons/chevron-right.svg"
            className="px-2 flex items-center"
          />
          <Link
            href={`/dashboard/${boardId}`}
            className="mb-2 hover:text-on-surface-variant"
          >
            {boardName}
          </Link>
        </div>
      )}
      {sectionName && (
        <div className="flex text-display-small lg:text-display-medium">
          <ReactSVG
            src="/icons/chevron-right.svg"
            className="px-2 flex items-center"
          />
          <Link
            href={`/dashboard/${boardId}/${sectionId}`}
            className="mb-2 hover:text-on-surface-variant"
          >
            {sectionName}
          </Link>
        </div>
      )}
    </div>
  );
}
