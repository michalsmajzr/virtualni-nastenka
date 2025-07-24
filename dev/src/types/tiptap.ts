import { JSONContent } from "@tiptap/core";

export interface Tiptap {
  content: JSONContent;
  onChange: (content: JSONContent) => void;
  name?: string;
}
