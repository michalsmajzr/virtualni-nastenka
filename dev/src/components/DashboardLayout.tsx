import clsx from "clsx";

export default function DashboardLayout({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={clsx(
        "w-full max-w-screen-xl mx-auto p-6 pt-22 pb-40 lg:pt-0 lg:pb-6 2xl:px-0",
        className
      )}
    >
      {children}
    </main>
  );
}
