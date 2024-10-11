"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "@/ui/components/TextEditor/toolbar";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextStyle from "@tiptap/extension-text-style";
import { useState } from "react";

// Define types for props
interface TextEditorProps {
  content: string;
  title?: string; // Optional title prop
  onChange: (data: { content: string; title: string }) => void; // Callback with both title and content
}

export default function TextEditor({
  content,
  title = "",
  onChange,
}: TextEditorProps) {
  const [postTitle, setPostTitle] = useState(title); // State for the post title

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-3",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3",
        },
      }),
      Highlight,
      Image,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      // Pass both content and title to the parent component
      onChange({
        content: editor.getHTML(),
        title: postTitle, // Include the title in the callback
      });
    },
  });

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setPostTitle(newTitle);
    onChange({
      content: editor?.getHTML() || content,
      title: newTitle,
    });
  };

  return (
    <div>
      <input
        type="text"
        value={postTitle}
        onChange={handleTitleChange}
        placeholder="Enter title"
        className="mb-2 w-full border rounded-md p-2 text-lg"
      />
      {/* Editor Toolbar and Content */}
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
