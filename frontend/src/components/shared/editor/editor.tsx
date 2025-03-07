import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { removeColorStyleHtml } from "@/lib/remove-color-style-html";
import { extensions } from "./extensions";
import {
  handleImageDrop,
  handleImagePaste,
  uploadFn,
} from "./editor.image-upload";
import { EditorToolbar } from "./toolbar";
import { handleCommandNavigation } from "./extensions/command-navigation";
import { ImageResizer } from "./extensions/image-resizer";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  onContentLengthChange?: (length: number) => void;
  placeholder?: string;
}

export const Editor = ({
  className,
  value,
  onChange,
  maxLength,
  onContentLengthChange,
  placeholder,
}: Props) => {
  const editor = useEditor({
    extensions: extensions({ limit: maxLength }),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "custom-prose focus:outline-none outline-none border px-8 py-6 rounded-lg relative w-full min-h-[140px] rounded-t-none border-t-0 min-w-full",
          className
        ),
      },
      transformPastedText: (text) => {
        text = text.replace(/&nbsp;/g, " ");
        return text;
      },
      transformPastedHTML: (html) => {
        return removeColorStyleHtml(html);
      },
      handleKeyDown: (view, event) => handleCommandNavigation(event),
      handlePaste: (view, event) =>
        handleImagePaste(view, event, uploadFn),
      handleDrop: (view, event, _slice, moved) =>
        handleImageDrop(view, event, moved, uploadFn),
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
      onContentLengthChange?.(editor.storage.characterCount.characters());
    },
    onCreate({ editor }) {
      onContentLengthChange?.(editor.storage.characterCount.characters());
    },
    autofocus: "end",
  });

  useEffect(() => {
    if (!editor || !value) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div>
      <EditorContext.Provider value={{ editor }}>
        {editor && (
          <EditorToolbar editor={editor} className={className}  />
        )}
        <EditorContent editor={editor} className="h-full" placeholder={placeholder} />
        <ImageResizer />
      </EditorContext.Provider>
    </div>
  );
};
