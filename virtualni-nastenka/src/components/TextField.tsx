import { clsx } from "clsx";

export default function TextField({
  text,
  color,
  type,
  name,
  value = "",
  error,
  onChange,
}: {
  text: string;
  color: string;
  type: string;
  name?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="group relative w-full flex flex-col text-body-large leading-6 tracking-wide">
      <span
        className={clsx(
          `absolute ml-3 mt-3 bg-${color} group-focus-within:ml-3 group-focus-within:px-1 group-focus-within:text-body-small group-focus-within:-translate-y-full transition ease-out`,
          value &&
            "text-body-small ml-3 px-1 -translate-y-full transition ease-out",
          error
            ? "text-error group-focus-within:text-error"
            : "group-focus-within:text-primary"
        )}
      >
        {text}
      </span>
      <input
        className={clsx(
          "px-4 py-3 bg-transparent border rounded cursor-text focus:outline focus:outline-2",
          error
            ? "border-error focus:outline-error"
            : "border-outline focus:border-primary focus:outline-primary"
        )}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
      {error && (
        <span className="block px-4 pt-1 text-error text-body-small leading-4 tracking-wide">
          {error}
        </span>
      )}
    </label>
  );
}
