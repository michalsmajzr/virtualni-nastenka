"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import IconButton from "@/components/IconButton";
import Menu from "@/components/Menu";
import MenuItem from "@/components/MenuItem";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from "@floating-ui/react";
import Badge from "@/components/Badge";

export default function Card({
  id,
  src,
  name,
  onClick,
  menuItems,
  archived = false,
  badgeCount,
  badgeType,
}: {
  id: number;
  src: string;
  name: string;
  onClick?: () => void;
  menuItems?: { text: string; onClick: () => void }[];
  archived?: boolean;
  badgeCount?: number;
  badgeType?: "small" | "large";
}) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(3), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <section
        key={id}
        onClick={archived ? () => setIsOpen(true) : onClick}
        className="group/card relative bg-surface-container-low shadow-level1 rounded-xl cursor-pointer"
      >
        <div className="z-10 absolute inset-0 bg-on-surface opacity-0 group-hover/card:opacity-10 rounded-xl"></div>
        {(badgeCount || badgeType) && (
          <div className="absolute right-0 p-2">
            <Badge count={badgeCount} type={badgeType} />
          </div>
        )}
        <Image
          src={src}
          width={1200}
          height={800}
          alt="Image 1"
          style={{
            objectFit: "cover",
          }}
          className="h-32 rounded-xl"
          priority
        />
        <div className="flex flex items-center justify-between pl-4 pr-2 py-2">
          <h2 className="py-1 text-title-medium-scale font-medium leading-6 truncate">
            {name}
          </h2>
          {status === "authenticated" && session?.user?.role === "teacher" && (
            <IconButton
              ref={refs.setReference}
              {...getReferenceProps({
                onClick: (e) => {
                  e.stopPropagation();
                },
              })}
              src="/icons/more-vert.svg"
              size="small"
              isOpen={isOpen}
            ></IconButton>
          )}
        </div>
      </section>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <Menu
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {menuItems?.map((item) => (
              <MenuItem
                key={item.text}
                text={item.text}
                onClick={item.onClick}
              ></MenuItem>
            ))}
          </Menu>
        </FloatingFocusManager>
      )}
    </>
  );
}
