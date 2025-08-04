export default function Menu({
  children,
  ref,
  style,
}: {
  children: React.ReactNode;
  ref: React.Ref<HTMLUListElement>;
  style: React.CSSProperties;
}) {
  return (
    <ul
      ref={ref}
      style={style}
      className="z-30 w-50 bg-surface-container overflow-hidden rounded-sm shadow-level2"
    >
      {children}
    </ul>
  );
}
