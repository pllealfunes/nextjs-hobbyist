"use client";

import { CldUploadButton } from "next-cloudinary";
import React from "react";

const cloudPresetName = process.env.CLOUDINARY_PRESET_NAME;

export default function CloudinaryUploader() {
  return (
    <div>
      <CldUploadButton
        options={{ multiple: true }}
        uploadPreset={cloudPresetName}
      >
        <span>Upload Image</span>
      </CldUploadButton>
    </div>
  );
}
