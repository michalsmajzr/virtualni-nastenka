export default function BoardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
      {children}
    </div>
  );
}
