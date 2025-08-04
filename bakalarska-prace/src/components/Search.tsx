import { ReactSVG } from "react-svg";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import clsx from "clsx";

/* inspirováno: https://nextjs.org/learn/dashboard-app/adding-search-and-pagination */

export default function Search({
  placeholder,
  isOpen,
}: {
  placeholder: string;
  isOpen: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <label
        className={clsx(
          "items-center w-full rounded-4xl sm:w-2xs sm:p-0 sm:pr-4 sm:bg-surface-container-high sm:flex",
          isOpen ? "flex" : "hidden"
        )}
      >
        <ReactSVG
          src="/icons/search.svg"
          className="hidden px-4 py-2.5 sm:inline"
        />
        <input
          type="search"
          name="search"
          className="flex-1 outline-none"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </label>
    </>
  );
}
