import { clsx } from "clsx";
import Badge from "@/components/Badge";

export default function TabItem({
  text,
  onClick,
  active,
  badgeCount,
}: {
  text: string;
  onClick?: () => void;
  active: boolean;
  badgeCount?: number;
}) {
  return (
    <li
      onClick={onClick}
      className={clsx(
        "relative group flex-1 flex items-center justify-center h-12 text-title-small text-on-surface-variant font-medium tracking-wide leading-5 cursor-pointer",
        active ? "border-b-2 border-primary" : "border-b border-outline-variant"
      )}
    >
      <div className="absolute inset-0 bg-on-surface opacity-0 group-hover:opacity-8"></div>
      <div className="flex items-center gap-1">
        <span>{text}</span>
        <Badge count={badgeCount} />
      </div>
    </li>
  );
}
