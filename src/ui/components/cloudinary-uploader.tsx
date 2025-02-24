"use client";

import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import React from "react";
import { Upload } from "lucide-react";

interface CloudinaryUploaderProps {
  onUpload: (url: string) => void;
}

export default function CloudinaryUploader({
  onUpload,
}: CloudinaryUploaderProps) {
  const handleSuccess = (result: any) => {
    const { secure_url } = result.info;
    onUpload(secure_url);
  };

  return (
    <div title="Images">
      <CldUploadWidget
        options={{
          multiple: true,
        }}
        signatureEndpoint="/api/imagetest"
        onSuccess={handleSuccess}
      >
        {({ open }) => (
          <div onClick={() => open()}>
            <Upload className="size-4" />
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}
