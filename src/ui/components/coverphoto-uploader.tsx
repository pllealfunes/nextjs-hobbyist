"use client";

import { useState } from "react";
import React from "react";
import { Upload } from "lucide-react";
import Image from "next/image";

interface CoverPhotoUploaderProps {
  onImageSelect: (url: string) => void;
}

export default function CoverPhotoUploader({
  onImageSelect,
}: CoverPhotoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      onImageSelect(fileUrl); // Pass the local URL to the parent
    }
  };

  return (
    <div>
      <label className="flex items-center space-x-2 cursor-pointer">
        <Upload className="size-4" />
        <span>Upload Cover Photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
      {previewUrl && (
        <div className="mt-4">
          <Image
            src={previewUrl}
            alt="Cover Photo Preview"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
