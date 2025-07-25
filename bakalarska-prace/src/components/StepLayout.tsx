export default function StepLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-screen-xl mx-auto h-dvh lg:h-screen">
      <main className="flex-1 flex flex-col w-full p-6 pt-22 bg-surface-container lg:p-14 lg:m-6 lg:rounded-3xl 2xl:mx-0">
        {children}
      </main>
    </div>
  );
}
