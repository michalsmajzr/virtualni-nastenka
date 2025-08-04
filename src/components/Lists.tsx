import Image from "next/image";

export default function Lists({
  src = "",
  headline = "",
  children,
}: {
  src: string | undefined;
  headline: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="group/lists relative flex items-center justify-between gap-4 w-full py-2 px-4 cursor-pointer">
      <div className="z-10 absolute inset-0 bg-on-surface opacity-0 group-hover/lists:opacity-10"></div>
      <div className="flex items-center gap-4 overflow-hidden">
        {src !== "" && (
          <Image
            src={src}
            alt={headline}
            width={56}
            height={56}
            className="h-14 w-14 object-cover"
            priority={true}
          />
        )}
        <span className="flex-1 max-w-32 text-body-large tracking-wide truncate sm:max-w-full">
          {headline}
        </span>
      </div>
      {children}
    </div>
  );
}
