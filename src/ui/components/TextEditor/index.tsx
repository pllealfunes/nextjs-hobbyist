"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "@/ui/components/TextEditor/toolbar";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect } from "react";

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const limit = 12500;

export default function TextEditor({ content, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Image,
      CharacterCount.configure({
        limit: 12500,
      }),
    ],
    content: content, // Set initial content
    editorProps: {
      attributes: {
        class: "min-h-[400px] border rounded-md py-4 px-4 text-lg",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Only update the content if the prop changes from outside (e.g., loading content)
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const percentage = editor
    ? Math.round((100 / limit) * editor.storage.characterCount.characters())
    : 0;

  return (
    <div className="tiptap">
      {/* Editor Toolbar */}
      <ToolBar editor={editor} />
      {/* Drag Handle for Reordering Blocks */}
      <DragHandle editor={editor}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </DragHandle>

      {/* Make the editor bigger */}
      <EditorContent editor={editor} />

      {/* Character and Word Count */}
      <div className="flex justify-end items-center mt-4">
        <div className="character-count flex items-center space-x-2">
          {/* Character count as circle gauge */}
          <svg height="40" width="40" viewBox="0 0 20 20">
            <circle r="10" cx="10" fill="#e9ecef" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="green"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
              transform="rotate(-90) translate(-20)"
            />
            <circle r="6" cx="10" cy="10" fill="white" />
          </svg>
          {editor.storage.characterCount.characters()} / {limit} characters
          <br />
          {editor.storage.characterCount.words()} words
        </div>
      </div>
    </div>
  );
}
