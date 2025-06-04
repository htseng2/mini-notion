import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import "../styles/tiptap.css";
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  QueueListIcon,
  LinkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "tiptap-bullet-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "tiptap-ordered-list",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "tiptap-list-item",
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      {!readOnly && (
        <div className="flex items-center gap-1 p-2 bg-card rounded-lg border border-border shadow-sm">
          <div className="flex items-center gap-1 border-r border-border pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-accent text-muted-foreground hover:text-primary transition-colors ${
                editor.isActive("bold") ? "bg-accent text-primary" : ""
              }`}
              title="Bold"
            >
              <BoldIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-accent text-muted-foreground hover:text-primary transition-colors ${
                editor.isActive("italic") ? "bg-accent text-primary" : ""
              }`}
              title="Italic"
            >
              <ItalicIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-1 border-r border-border px-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-accent text-muted-foreground hover:text-primary transition-colors ${
                editor.isActive("bulletList") ? "bg-accent text-primary" : ""
              }`}
              title="Bullet List"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-accent text-muted-foreground hover:text-primary transition-colors ${
                editor.isActive("orderedList") ? "bg-accent text-primary" : ""
              }`}
              title="Numbered List"
            >
              <QueueListIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-1 pl-2">
            <button
              onClick={() => {
                const url = window.prompt("Enter URL");
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={`p-2 rounded hover:bg-accent text-muted-foreground hover:text-primary transition-colors ${
                editor.isActive("link") ? "bg-accent text-primary" : ""
              }`}
              title="Add Link"
            >
              <LinkIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                const url = window.prompt("Enter image URL");
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }}
              className="p-2 rounded hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
              title="Add Image"
            >
              <PhotoIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="prose prose-neutral dark:prose-invert max-w-none min-h-[500px] rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-ring"
      />
    </div>
  );
}
