"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "@/ui/components/TextEditor/toolbar";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import CharacterCount from "@tiptap/extension-character-count";
import FileHandler from "@tiptap-pro/extension-file-handler";
import ImageResize from "tiptap-extension-resize-image";
import { useEffect, useState } from "react";

interface TextEditorProps {
  content: string | object;
  onChange: (content: string | object) => void;
}

const limit = 12500;

export default function TextEditor({ content, onChange }: TextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Image,
      ImageResize,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
              // Insert image locally first
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: { src: fileReader.result },
                })
                .focus()
                .run();

              // Upload to Cloudinary
              setIsUploading(true);
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", "tiptap_uploads"); // Replace with your preset

              fetch(
                "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
                {
                  method: "POST",
                  body: formData,
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  currentEditor.commands.setImage({ src: data.secure_url });
                })
                .finally(() => setIsUploading(false));
            };
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              console.log("Pasted HTML content:", htmlContent);
              return false; // Prevent duplicate insertion
            }

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: { src: fileReader.result },
                })
                .focus()
                .run();
            };
          });
        },
      }), // Missing closing bracket and comma added here
      CharacterCount.configure({
        limit: 12500,
      }),
    ],
    content: content,
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

      {isUploading && <p>Uploading image...</p>}
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
