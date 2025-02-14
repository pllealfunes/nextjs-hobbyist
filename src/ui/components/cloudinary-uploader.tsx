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

interface UploadResultInfo {
  secure_url: string;
}

export default function CloudinaryUploader({
  onUpload,
}: CloudinaryUploaderProps) {
  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (typeof result.info === "string" || typeof result.info === "undefined") {
      // Handle error or unexpected type
      console.error("Unexpected result format");
      return;
    }
    const { secure_url } = result.info as UploadResultInfo;
    onUpload(secure_url);
  };

  return (
    <div>
      <CldUploadWidget
        options={{ multiple: true }}
        signatureEndpoint="/api/sign-image"
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
