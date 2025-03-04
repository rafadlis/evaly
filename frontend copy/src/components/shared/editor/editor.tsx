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
  editorInputClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  onContentLengthChange?: (length: number) => void;
}

export const Editor = ({
  className,
  editorInputClassName,
  value,
  onChange,
  maxLength,
  onContentLengthChange,
}: Props) => {
  const editor = useEditor({
    extensions: extensions({ limit: maxLength }),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "custom-prose focus:outline-none outline-none relative py-2 px-6 border border-foreground/20 border-t-0 w-full min-h-[160px] min-w-full rounded-b-xl",
          editorInputClassName
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
    <div className={cn("", className)}>
      <EditorContext.Provider value={{ editor }}>
        {editor && (
          <EditorToolbar editor={editor}  />
        )}
        <EditorContent editor={editor} className="h-full" />
        <ImageResizer />
      </EditorContext.Provider>
    </div>
  );
};
