import clsx from "clsx";

export default function Badge({
  count,
  type = "large",
  visible = true,
}: {
  count?: number;
  type?: "small" | "large";
  visible?: boolean;
}) {
  if (!visible || count == 0) {
    return;
  }

  let newCount;
  if (count && count > 999) {
    newCount = "999+";
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center p-1 bg-error text-on-error text-label-small font-medium tracking-wide rounded-full",
        type === "small" ? "w-1.5 h-1.5" : "min-w-4 h-4"
      )}
    >
      {type === "small" ? "" : newCount ? newCount : count}
    </div>
  );
}
