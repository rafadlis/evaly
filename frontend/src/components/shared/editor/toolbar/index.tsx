import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor as TiptapEditor } from "@tiptap/react";
import { List, ListOrdered, Quote, Code } from "lucide-react";
import InsertLink from "./insert-link";
import EditorMenuTextStyle from "../editor-menu.text-style";

export const EditorToolbar = ({
  className,
  editor,
}: {
  className?: string;
  editor: TiptapEditor;
}) => {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap gap-1 items-center bg-background/80 backdrop-blur-sm z-50 sticky top-0 p-3 rounded-lg rounded-b-none border",
        className
      )}
    >
      <EditorMenuTextStyle editor={editor} />

      <div className="border-l border-foreground/50 border-dashed h-4 mx-2"></div>

      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "ghost"}
        className="text-base"
        rounded={false}
      >
        B
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "ghost"}
        rounded={false}
        className="italic font-mono text-base"
      >
        I
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        variant={editor.isActive("underline") ? "default" : "ghost"}
        rounded={false}
        className="font-mono  underline text-base"
      >
        U
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "default" : "ghost"}
        rounded={false}
        className="font-mono  line-through text-base"
      >
        S
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        variant={editor.isActive("blockquote") ? "default" : "ghost"}
        rounded={false}
      >
        <Quote size={16} />
      </Button>

      <div className="border-l border-foreground/50 border-dashed h-4 mx-2"></div>

      <Button
        size={"icon-sm"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        rounded={false}
      >
        <List size={16} />
      </Button>
      <Button
        size={"icon-sm"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        rounded={false}
      >
        <ListOrdered size={16} />
      </Button>

      <div className="border-l border-foreground/50 border-dashed h-4 mx-2"></div>
      
      <Button
        size={"icon-sm"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        variant={editor.isActive("codeBlock") ? "default" : "ghost"}
        rounded={false}
      >
        <Code size={16} />
      </Button>

      <div className="border-l border-foreground/50 border-dashed h-4 mx-2"></div>

      <InsertLink editor={editor} />
      {/* <InsertImage editor={editor} /> */}
    </div>
  );
};
