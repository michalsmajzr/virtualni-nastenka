"use client";
import { ReactSVG } from "react-svg";
import { clsx } from "clsx";
import Image from "next/image";

export default function Message({
  src,
  message = "",
  attachment_name,
  url,
  type = "sender",
}: {
  src?: string;
  message?: string;
  attachment_name?: string;
  url?: string;
  type: "sender" | "receiver";
}) {
  return (
    <div
      className={clsx("flex items-center gap-2", {
        "justify-end": type === "sender",
        "justify-start": type === "receiver",
      })}
    >
      {type === "receiver" ? (
        <div className="flex items-center justify-center">
          {src ? (
            <Image
              src={src}
              width={36}
              height={36}
              style={{
                objectFit: "cover",
              }}
              alt={message}
              className="h-9 w-9 text-on-surface-variant rounded-full"
            />
          ) : (
            <ReactSVG
              src="/icons/account-circle-40dp.svg"
              className="flex items-center justify-center text-on-surface-variant rounded-full"
            />
          )}
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col gap-4">
        {url && attachment_name && (
          <div
            className={clsx("p-3 rounded-t-20", {
              "text-on-secondary-container bg-secondary-container rounded-br-lg rounded-bl-20":
                type === "sender",
              "bg-surface-container-highest rounded-br-20 rounded-bl-lg":
                type === "receiver",
            })}
          >
            <a href={url} className="flex items-center gap-1">
              <ReactSVG src="/icons/attach-file-20dp.svg" />
              {attachment_name}
            </a>
          </div>
        )}
        {message && (
          <div
            className={clsx("rounded-t-20", {
              "p-3 text-on-secondary-container bg-secondary-container rounded-br-lg rounded-bl-20":
                type === "sender",
              "p-3 bg-surface-container-highest rounded-br-20 rounded-bl-lg":
                type === "receiver",
            })}
          >
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
