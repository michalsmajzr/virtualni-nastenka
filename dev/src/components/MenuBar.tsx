"use client";
import { useState } from "react";
import { Editor } from "@tiptap/react";
import IconButton from "./IconButton";
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

/* dle: https://tiptap.dev/docs/examples/basics/default-text-editor */

export default function MenuBar({ editor }: { editor: Editor | null }) {
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

  if (!editor) {
    return null;
  }

  return (
    <div className="flex p-2 max-w-full text-on-surface-variant bg-surface-container overflow-auto rounded-3xl">
      <div className="flex gap-2 w-fit">
        <div className="flex gap-1">
          <IconButton
            src="/icons/undo.svg"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          />
          <IconButton
            src="/icons/redo.svg"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          />
        </div>
        <div className="h-6 border-r border-outline"></div>
        <div className="flex gap-1">
          <IconButton
            src="/icons/format-bold.svg"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          />
          <IconButton
            src="/icons/format-italic.svg"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          />
          <IconButton
            src="/icons/format-strikethrough.svg"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
          />
          <IconButton
            src="/icons/format-underlined.svg"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
          />
        </div>
        <div className="h-6 border-r border-outline"></div>
        <div className="flex gap-1">
          <IconButton
            ref={refs.setReference}
            {...getReferenceProps({
              onClick: (e) => {
                e.stopPropagation();
              },
            })}
            src="/icons/format-text-clip.svg"
            active={editor.isActive("heading")}
            isOpen={isOpen}
          />
          <IconButton
            src="/icons/format-list-bulleted.svg"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          />
          <IconButton
            src="/icons/format-list-numbered.svg"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
          />
          <IconButton
            src="/icons/align-horizontal-left.svg"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
          />
        </div>
        <div className="h-6 border-r border-outline"></div>
        <div className="flex gap-1">
          <IconButton
            src="/icons/code.svg"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
          />
          <IconButton
            src="/icons/code-blocks.svg"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
          />
        </div>
        <div className="h-6 border-r border-outline"></div>
        <div className="flex gap-1">
          <IconButton
            src="/icons/superscript.svg"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            active={editor.isActive("superscript")}
          />
          <IconButton
            src="/icons/subscript.svg"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            active={editor.isActive("subscript")}
          />
        </div>

        <div className="h-6 border-r border-outline"></div>
        <div className="flex gap-1">
          <IconButton
            src="/icons/format-align-left.svg"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
          />
          <IconButton
            src="/icons/format-align-center.svg"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
          />
          <IconButton
            src="/icons/format-align-right.svg"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
          />
          <IconButton
            src="/icons/format-align-justify.svg"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
          />
        </div>
      </div>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-30 flex flex-col gap-1 bg-surface-container overflow-hidden rounded-sm shadow-level2"
          >
            <IconButton
              src="/icons/format-h1.svg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              active={editor.isActive("heading", {
                level: 1,
              })}
            />
            <IconButton
              src="/icons/format-h2.svg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor.isActive("heading", {
                level: 2,
              })}
            />
            <IconButton
              src="/icons/format-h3.svg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              active={editor.isActive("heading", {
                level: 3,
              })}
            />
            <IconButton
              src="/icons/format-h4.svg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              active={editor.isActive("heading", {
                level: 4,
              })}
            />
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
}
