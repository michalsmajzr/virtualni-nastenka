import clsx from "clsx";

export default function StepLayout({
  children,
  step,
  maxStep,
}: {
  children?: React.ReactNode;
  step?: number;
  maxStep?: number;
}) {
  let progress;
  if (!step || !maxStep) {
    progress = 0;
  } else {
    progress = (step / maxStep) * 100;
    console.log(progress, maxStep, step);
  }

  return (
    <div className="flex w-full max-w-screen-xl mx-auto h-dvh lg:h-screen">
      <main
        className={clsx(
          "relative flex-1 flex flex-col w-full p-6 pt-22 bg-surface-container lg:p-14 lg:m-6 2xl:mx-0",
          maxStep ? "lg:rounded-b-3xl" : "lg:rounded-3xl"
        )}
      >
        {maxStep && (
          <div className="absolute left-0 top-16 w-full h-1 bg-outline-variant lg:top-0">
            {/* použil jsem atribut style z důvodu, že tailwind nelze jednoduše nastavit dynamicky třídu za běhu */}
            <div
              className="left-0 h-full bg-primary"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
