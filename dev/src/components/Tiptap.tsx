import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Tiptap as TiptapInterface } from "@/types/tiptap";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import MenuBar from "@/components/MenuBar";
import { useTheme } from "next-themes";
import { clsx } from "clsx";

/* dle: https://tiptap.dev/docs/editor/getting-started/install/nextjs */

export default function Tiptap({ content, onChange, name }: TiptapInterface) {
  const { data: session, status } = useSession();
  const { theme } = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Subscript,
      Superscript,
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: clsx(
          "prose flex-1 max-w-none p-6 bg-surface-container outline-none rounded-t-3xl lg:p-12",
          {
            "dark:prose-invert": theme === "dark",
          }
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "teacher") {
      editor?.setEditable(false);
    }
  }, [editor, session]);

  return (
    <div className="flex-1 flex flex-col items-center gap-6 overflow-hidden">
      {status === "authenticated" && session?.user?.role === "teacher" ? (
        <MenuBar editor={editor} />
      ) : (
        <div className="hidden justify-center w-full px-6 py-3 text-title-large bg-surface-container rounded-3xl lg:flex">
          <h2>{name}</h2>
        </div>
      )}

      <div className="flex-1 flex flex-col w-full overflow-auto">
        <EditorContent editor={editor} className="flex-1 flex flex-col" />
      </div>
    </div>
  );
}
