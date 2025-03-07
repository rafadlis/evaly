import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Editor } from '@tiptap/core';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const EditorMenuTextStyle = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size={"sm"}
            
            variant={"outline"}
            className="justify-between px-2 w-[100px]"
          >
            {editor.getAttributes("heading").level
              ? `Heading ${editor.getAttributes("heading").level}`
              : "Text"}
            <ChevronDown size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-2'>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(
              "w-full hover:bg-foreground/10 px-4 py-2 text-start flex flex-col rounded-lg",
              { "bg-primary/20": editor.isActive("paragraph") }
            )}
          >
            <span className="font-medium text-base">Text</span>
            <span className="opacity-70 text-xs">
              Just start writing with plain text.
            </span>
          </button>
  
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={cn(
              "w-full hover:bg-foreground/10 px-4 py-2 text-start flex flex-col rounded-lg",
              { "bg-primary/20": editor.isActive("heading", { level: 1 }) }
            )}
          >
            <span className="font-medium text-base">Heading 1</span>
            <span className="opacity-70 text-xs">Big section heading.</span>
          </button>
  
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={cn(
              "w-full hover:bg-foreground/10 px-4 py-2 text-start flex flex-col rounded-lg",
              { "bg-primary/20": editor.isActive("heading", { level: 2 }) }
            )}
          >
            <span className="font-medium text-base">Heading 2</span>
            <span className="opacity-70 text-xs">Medium section heading.</span>
          </button>
  
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={cn(
              "w-full hover:bg-foreground/10 px-4 py-2 text-start flex flex-col rounded-lg",
              { "bg-primary/20": editor.isActive("heading", { level: 3 }) }
            )}
          >
            <span className="font-medium text-base">Heading 3</span>
            <span className="opacity-70 text-xs">Small section heading.</span>
          </button>
        </PopoverContent>
      </Popover>
    );
}

export default EditorMenuTextStyle