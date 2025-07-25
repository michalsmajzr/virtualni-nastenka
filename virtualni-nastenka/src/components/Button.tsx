import { clsx } from "clsx";

export default function Button({
  text,
  type,
  buttonType,
  onClick,
}: {
  text: string;
  type?: "submit" | "button";
  buttonType: "filled" | "tonal" | "text";
  onClick?: () => void | Promise<void> | undefined;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "relative overflow-hidden flex items-center justify-center w-fit h-10 px-6 text-label-large font-medium leading-5 rounded-full cursor-pointer hover:shadow-sm",
        { "bg-primary text-on-primary": buttonType === "filled" },
        {
          "bg-secondary-container text-on-secondary-container":
            buttonType === "tonal",
        },
        { "text-primary": buttonType === "text" }
      )}
    >
      <span
        className={clsx(
          "absolute inset-0 opacity-0 hover:opacity-8",
          { "bg-on-primary": buttonType === "filled" },
          { "bg-on-secondary-container": buttonType === "tonal" },
          { "bg-primary": buttonType === "text" }
        )}
      ></span>
      <span>{text}</span>
    </button>
  );
}
