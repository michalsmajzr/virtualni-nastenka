"use client";
import { usePathname, useParams } from "next/navigation";
import { useState } from "react";
import TopBarLinks from "@/components/TopBarLinks";
import Search from "@/components/Search";
import IconButton from "@/components/IconButton";
import HamburgerMenu from "@/components/HamburgerMenu";
import HamburgerMenuLinks from "@/components/HamburgerMenuLinks";
import clsx from "clsx";

export default function TobBar({
  name,
  onClick,
  desktopVisible = true,
  header,
}: {
  name?: string;
  onClick?: () => void;
  desktopVisible?: boolean;
  header?: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const [isOpenMobileSearch, setIsOpenMobileSearch] = useState(false);

  return (
    <header
      className={clsx(
        "fixed z-50 flex items-center justify-between gap-2 w-full h-16 px-3 py-2 text-on-surface-variant",
        "bg-surface-container-low lg:px-6 lg:bg-surface lg:justify-end lg:static lg:z-10 lg:px-12",
        { "lg:hidden": !desktopVisible }
      )}
    >
      <div className="flex items-center overflow-hidden lg:hidden">
        {onClick && (
          <IconButton
            src="/icons/arrow-back.svg"
            size="medium"
            onClick={onClick}
          />
        )}
        <div
          className={clsx("overflow-hidden lg:block", {
            hidden: isOpenMobileSearch,
          })}
        >
          {name ? (
            <h1 className="ml-3 truncate text-title-large">{name}</h1>
          ) : (
            header
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-end gap-2">
        {(pathname === `/dashboard` ||
          pathname === `/dashboard/${params.boardId}` ||
          pathname === `/dashboard/${params.boardId}/${params.sectionId}`) && (
          <>
            <Search
              placeholder="Vyhledejte příspěvek..."
              isOpen={isOpenMobileSearch}
            />
            {isOpenMobileSearch ? (
              <>
                <IconButton
                  type="button"
                  src="/icons/close.svg"
                  onClick={() => setIsOpenMobileSearch(false)}
                  className="sm:hidden"
                />
              </>
            ) : (
              <IconButton
                type="button"
                src="/icons/search.svg"
                onClick={() => setIsOpenMobileSearch(true)}
                className="sm:hidden"
              />
            )}
          </>
        )}
      </div>
      <div className="lg:hidden">
        <IconButton
          src="/icons/menu.svg"
          size="medium"
          onClick={() => setIsOpen(true)}
        />
        <HamburgerMenu isOpen={isOpen} close={() => setIsOpen(false)}>
          <HamburgerMenuLinks />
        </HamburgerMenu>
      </div>

      <div className="hidden lg:flex lg:items-center lg:justify-center">
        <TopBarLinks />
      </div>
    </header>
  );
}
