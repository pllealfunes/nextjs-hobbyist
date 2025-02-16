"use client";

import { CldUploadWidget } from "next-cloudinary";
import React from "react";
import { Upload } from "lucide-react";

interface CoverPhotoUploaderProps {
  onUpload: (url: string) => void;
}

export default function CoverPhotoUploader({
  onUpload,
}: CoverPhotoUploaderProps) {
  const handleSuccess = (result: any) => {
    const { secure_url } = result.info;
    onUpload(secure_url);
  };

  return (
    <CldUploadWidget
      options={{ multiple: false }}
      signatureEndpoint="/api/sign-image"
      onSuccess={handleSuccess}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="flex items-center space-x-2"
        >
          <Upload className="size-4" />
          <span>Upload Cover Photo</span>
        </button>
      )}
    </CldUploadWidget>
  );
}
