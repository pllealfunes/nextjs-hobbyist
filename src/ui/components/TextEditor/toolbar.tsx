"use client";

import { Toggle } from "@/ui/components/toggle";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Code,
  Bold,
  Italic,
  Strikethrough,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Highlighter,
  Undo,
  Redo,
  TextQuote,
  Space,
  List,
  SeparatorHorizontal,
  Camera,
  Video,
} from "lucide-react";
import { ListOrdered } from "lucide-react";
import { Editor } from "@tiptap/react";

// Define the prop types
interface ToolBarProps {
  editor: Editor | null;
}

export default function ToolBar({ editor }: ToolBarProps) {
  if (!editor) return null;

  const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files); // Handle multiple files

    for (const file of files) {
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
          const base64data = reader.result?.toString() || "";

          // Ensure each image is inserted at a unique position
          editor
            .chain()
            .insertContentAt(editor.state.doc.content.size, {
              type: "image",
              attrs: { src: base64data },
            })
            .focus()
            .run();

          resolve(null);
        };
      });
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      // Validate if it's a YouTube URL (basic check)
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([a-zA-Z0-9_-]+)$/;

      if (!youtubeRegex.test(url)) {
        alert("Please enter a valid YouTube URL.");
        return;
      }

      // Add video to the editor
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Heading4 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      pressed: editor.isActive("heading", { level: 4 }),
    },
    {
      icon: <Heading5 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      pressed: editor.isActive("heading", { level: 5 }),
    },
    {
      icon: <Heading6 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      pressed: editor.isActive("heading", { level: 6 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("code"),
    },
    {
      icon: <TextQuote className="size-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      pressed: editor.isActive("blockquote"),
    },
    {
      icon: <SeparatorHorizontal className="size-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      pressed: editor.isActive("horizontalrule"),
    },
    {
      icon: <Space className="size-4" />,
      onClick: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
    {
      icon: <Camera className="size-4" />,
      onClick: () => document.getElementById("imageUploadInput")?.click(),
      pressed: editor.isActive("image"),
    },
    {
      icon: <Video className="size-4" />,
      onClick: addYoutubeVideo,
      pressed: editor.isActive("video"),
    },
    {
      icon: <Undo className="size-4" />,
      onClick: () => editor.chain().focus().undo().run(),
      pressed: editor.isActive("undo"),
    },
    {
      icon: <Redo className="size-4" />,
      onClick: () => editor.chain().focus().redo().run(),
      pressed: editor.isActive("redo"),
    },
  ];

  return (
    <div className="border rounded-md p-1.5 mb-1 sticky top-10 z-50 flex flex-wrap items-center gap-1 overflow-hidden">
      {Options.map((option, i) => (
        <Toggle
          key={i}
          size="sm"
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
      <input
        type="file"
        id="imageUploadInput"
        accept="image/png, image/jpeg, image/gif, image/webp"
        className="hidden"
        onChange={addImage}
      />
    </div>
  );
}
