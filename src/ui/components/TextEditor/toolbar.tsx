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
  ListOrdered,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/dialog";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { Button } from "@/ui/components/button";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { fileToBase64 } from "@/utils/postHandler";

// Define the prop types
interface ToolBarProps {
  editor: Editor | null;
}

export default function ToolBar({ editor }: ToolBarProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!editor) return null;

  const addImage = (() => {
    const queue: string[] = [];
    let isProcessing = false;

    return async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || !editor) return;

      const files = Array.from(event.target.files);
      const base64Images = await Promise.all(files.map(fileToBase64));

      queue.push(...base64Images);

      if (isProcessing) return;
      isProcessing = true;

      while (queue.length > 0) {
        const image = queue.shift();
        if (!image) continue;

        const { doc } = editor.state;

        // Insert at the very end of the document (after the last node)
        let insertPos = doc.content.size;
        doc.descendants((node, pos) => {
          if (node.type.name === "image") {
            insertPos = pos + node.nodeSize;
          }
        });

        editor
          .chain()
          .focus()
          .insertContentAt(insertPos, {
            type: "image",
            attrs: { src: image },
          })
          .run();

        // Wait for TipTap to flush its updates before moving to the next image
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      isProcessing = false;
    };
  })();

  const youtubeRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const vimeoRegex =
    /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:groups\/\d+\/videos\/|video\/|)(\d+)/;

  const addVideo = () => {
    const matchYouTube = videoUrl.match(youtubeRegex);
    const matchVimeo = videoUrl.match(vimeoRegex);

    if (!matchYouTube && !matchVimeo) {
      alert("Please enter a valid YouTube or Vimeo link.");
      return;
    }

    let formattedUrl = videoUrl;

    // Convert YouTube link to embed format
    if (matchYouTube) {
      const videoId = matchYouTube[1];
      formattedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    // Convert Vimeo link to embed format
    if (matchVimeo) {
      const videoId = matchVimeo[1];
      formattedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    console.log("Submitting:", formattedUrl);

    // ✅ Insert a new video node at the current selection without replacing anything
    editor
      ?.chain()
      .focus()
      .insertContentAt(editor.state.selection.anchor, {
        type: "video",
        attrs: { src: formattedUrl },
      })
      .run();

    // Reset input and close dialog
    setVideoUrl("");
    setIsDialogOpen(false);
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
      onClick: () => setIsDialogOpen(true),
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
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setVideoUrl(""); // Clear videoUrl when closing the dialog
          }
        }}
      >
        <DialogTrigger asChild>
          <button style={{ display: "none" }}></button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
            <DialogDescription>
              Paste a link from YouTube or Vimeo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" onClick={addVideo}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
