"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { clsx } from "clsx";
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

export default function Question({
  text = "",
  onClick,
  active = false,
  menuItems,
  badgeType,
}: {
  text: string;
  onClick: () => void;
  active: boolean;
  menuItems?: { text: string; onClick: () => void }[];
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
      <div
        onClick={onClick}
        className={clsx(
          "z-10 group/question relative flex items-center justify-center gap-3 max-h-14 pl-4 p-4 rounded-xl cursor-pointer",
          active ? "bg-surface-container-highest" : "bg-surface-container-low"
        )}
      >
        <div className="z-10 absolute inset-0 bg-on-surface opacity-0 group-hover/question:opacity-10 rounded-xl"></div>
        <div className="flex-1 overflow-hidden flex items-center justify-between">
          <span className="truncate text-body-large font-medium tracking-wide leading-6">
            {text}
          </span>
          <div className="flex items-center gap-3">
            {badgeType && <Badge type={badgeType} />}
            {status === "authenticated" &&
              session?.user?.role === "teacher" && (
                <IconButton
                  ref={refs.setReference}
                  {...getReferenceProps({
                    onClick: (e) => {
                      e.stopPropagation();
                    },
                  })}
                  src="/icons/more-vert.svg"
                  isOpen={isOpen}
                ></IconButton>
              )}
          </div>
        </div>
      </div>
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
