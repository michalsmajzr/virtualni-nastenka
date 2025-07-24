"use client";
import { ReactSVG } from "react-svg";
import { clsx } from "clsx";
import Image from "next/image";

export default function IconButton({
  src = "/icons/edit.svg",
  type,
  size = "medium",
  onClick = () => {},
  children,
  ref,
  isOpen,
  disabled,
  active = false,
  className,
}: {
  src: string;
  type?: "submit" | "button";
  size?: "small" | "medium" | "large";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  isOpen?: boolean;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}) {
  return (
    <>
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={clsx("group relative", className, {
          "bg-secondary-container rounded-full": active,
        })}
      >
        <span
          className={clsx(
            "z-30 absolute inset-0 bg-on-surface-variant opacity-0 rounded-full cursor-pointer",
            isOpen ? "opacity-8" : "group-hover:opacity-8"
          )}
        ></span>
        {src.startsWith("/api") ? (
          <Image
            src={src}
            alt={src}
            width={36}
            height={36}
            className="w-9 h-9 m-1 object-fit cursor-pointer"
          />
        ) : (
          <>
            <span
              className={clsx(
                "z-20 flex items-center",
                {
                  "p-1": size === "small",
                },
                {
                  "p-2": size === "medium",
                },
                {
                  "p-3": size === "large",
                }
              )}
            >
              <ReactSVG src={src} />
            </span>
          </>
        )}

        {children}
      </button>
    </>
  );
}
