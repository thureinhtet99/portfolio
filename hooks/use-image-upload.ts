"use client";

import { useState } from "react";
import { toast } from "sonner";

type UploadResponse = { success: boolean; url?: string; error?: string };

/**
 * Wraps the upload-to-/api/upload flow duplicated in
 * certificate-section.tsx and project-section.tsx (both hand-roll the same
 * FormData -> POST /api/upload -> read .url sequence).
 *
 * `existingUrl` is the current image URL already saved on the record being
 * edited (formData.image) — used as the fallback if the user never picks a
 * new file.
 */
export function useImageUpload(existingUrl?: string) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);

  const onSelectFile = (selected: File | null) => {
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  /** Uploads the picked file if any; otherwise resolves to existingUrl unchanged. */
  const upload = async (): Promise<string | undefined> => {
    if (!file) return existingUrl;

    setIsUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("type", "image");

      const res = await fetch("/api/upload", { method: "POST", body });
      const json: UploadResponse = await res.json();

      if (!json.success || !json.url) {
        throw new Error(json.error || "Image upload failed");
      }

      return json.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image upload failed";
      toast.error(message);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(existingUrl ?? null);
  };

  return { file, preview, isUploading, onSelectFile, upload, reset };
}
