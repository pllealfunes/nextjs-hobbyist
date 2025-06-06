"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "@/ui/components/TextEditor/toolbar";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import CharacterCount from "@tiptap/extension-character-count";
import ImageResize from "tiptap-extension-resize-image";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Video from "@/ui/components/video-uploader";
import { useEffect, useState } from "react";

interface TextEditorProps {
  content: string | object;
  onChange: (content: string | object) => void;
}

const limit = 12500;

export default function TextEditor({ content, onChange }: TextEditorProps) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Image,
      ImageResize,
      Video,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
              const base64data = reader.result?.toString() || "";

              // Insert without overwriting existing images
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: { src: base64data },
                })
                .focus()
                .run();
            };
          });
        },

        onPaste: (currentEditor, files, htmlContent) => {
          if (htmlContent) {
            console.log("Pasted HTML content:", htmlContent);
            return false; // Prevent duplicate pasting
          }

          files.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
              const base64data = reader.result?.toString() || "";

              // Prevent duplicates by checking if the image already exists
              const existingImages = currentEditor
                .getJSON()
                .content?.some(
                  (node) =>
                    node.type === "image" && node.attrs?.src === base64data
                );

              if (existingImages) return;

              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: { src: base64data },
                })
                .focus()
                .run();
            };
          });
        },
      }),
      CharacterCount.configure({
        limit: 12500,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        spellcheck: "true",
        class: "min-h-[500px] border rounded-md py-4 px-4 text-lg",
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();

      if (newContent !== content) {
        if (debounceTimer) clearTimeout(debounceTimer);

        const timer = setTimeout(() => {
          onChange(newContent);
        }, 300); // 300ms debounce

        setDebounceTimer(timer);
      }
    },
    immediatelyRender: false,
  });

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
          stroke="black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </DragHandle>

      <EditorContent editor={editor} />

      {/* Character and Word Count */}
      <div className="flex justify-end items-center mt-4">
        <div
          className={`character-count ${
            editor.storage.characterCount.characters() === limit
              ? "character-count--warning"
              : ""
          }`}
        >
          {/* Character count as circle gauge */}
          <svg height="40" width="40" viewBox="0 0 20 20">
            <circle r="10" cx="10" fill="transparent" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${(percentage * 31.4) / 100} 31.4`}
              transform="rotate(-90) translate(-20)"
            />
            <circle r="6" cx="10" cy="10" fill="grey" />
          </svg>
          {editor.storage.characterCount.characters()} / {limit} characters
          <br />
          {editor.storage.characterCount.words()} words
        </div>
      </div>
    </div>
  );
}
