import clsx from "clsx";

export default function SectionLayout({
  children,
  isVisibleSideNavOnMobile = false,
}: {
  children?: React.ReactNode;
  isVisibleSideNavOnMobile?: boolean;
}) {
  return (
    <main
      className={clsx(
        "w-full max-w-screen-xl min-h-dvh mx-auto p-6 pt-22 bg-surface-container lg:min-h-0 lg:pt-0 lg:pb-6 lg:bg-surface 2xl:px-0",
        isVisibleSideNavOnMobile ? "pb-22" : "pb-6"
      )}
    >
      {children}
    </main>
  );
}
