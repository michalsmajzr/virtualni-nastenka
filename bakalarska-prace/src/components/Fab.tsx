"use client";
import { ReactSVG } from "react-svg";

export default function Fab({
  src = "/icons/edit.svg",
  onClick,
}: {
  src: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden w-14 h-14 flex items-center justify-center px-4 bg-primary text-on-primary text-label-large 
        font-medium leading-5 rounded-2xl shadow-level3 cursor-pointer hover:shadow-level4 lg:shadow-none lg:hover:shadow-level4"
    >
      <span className="absolute inset-0 bg-on-primary-container opacity-0 hover:opacity-8"></span>
      <ReactSVG src={src} />
    </button>
  );
}
