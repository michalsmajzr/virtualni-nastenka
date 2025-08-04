import Button from "@/components/Button";

export default function TextDialog({
  text = "",
  close,
  submit,
}: {
  text: string;
  close: () => void;
  submit: () => void;
}) {
  return (
    <section className="min-w-72 max-w-xl p-6 flex flex-col items-center justify-between bg-surface-container-high rounded-xl">
      <h2 className="mb-4 text-wrap text-center text-headline-small">{text}</h2>
      <div className="w-full flex items-center justify-end gap-2">
        <Button text="Zrušit" type="button" buttonType="text" onClick={close} />
        <Button text="Ano" type="button" buttonType="filled" onClick={submit} />
      </div>
    </section>
  );
}
