"use client";

import { useState } from "react";
import React from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "@/ui/components/button";

interface PhotoUploaderProps {
  onImageSelect: (file: File | null) => void; // Pass a File object instead of a string
}

export default function PhotoUploader({ onImageSelect }: PhotoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file)); // Create a temporary URL for preview

      onImageSelect(file); // Pass the File object to the parent
    }
    console.log(file);
  };

  const removePhoto = () => {
    setPreviewUrl(null);

    onImageSelect(null);
  };

  return (
    <div>
      {previewUrl ? (
        <div className="mt-4">
          <Image
            src={previewUrl}
            alt="Photo Preview"
            width={200}
            height={200}
            className="rounded-lg"
          />
          <Button className="mt-4" onClick={removePhoto}>
            Remove Photo
          </Button>
        </div>
      ) : (
        <label className="flex items-center space-x-2 cursor-pointer">
          <Upload className="size-4" />
          <span>Upload Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
