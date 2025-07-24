export default function MenuItem({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className="relative group h-12 px-3 py-2 flex items-center text-label-large leading-5 font-medium tracking-wide cursor-pointer"
    >
      <div className="absolute inset-0 bg-on-surface opacity-0 group-hover:opacity-8"></div>
      <span>{text}</span>
    </li>
  );
}
