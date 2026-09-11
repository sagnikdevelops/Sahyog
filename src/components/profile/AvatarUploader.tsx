"use client";

import React, { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initialsFromName } from "@/lib/auth/guest";

export function AvatarUploader({
  name,
  url,
  onUpload,
  onRemove,
  disabled,
}: {
  name: string;
  url?: string;
  onUpload: (file: File) => Promise<{ url?: string; error?: string }> | void;
  onRemove: () => Promise<{ error?: string }> | void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(url);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Cleanup object URLs when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (file: File) => {
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setSelectedFile(file);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => !disabled && inputRef.current?.click()}
        className="relative"
        aria-label="Change avatar"
      >
        <Avatar className="h-20 w-20">
          {preview ? <AvatarImage src={preview} alt={name} /> : null}
          <AvatarFallback>{initialsFromName(name)}</AvatarFallback>
        </Avatar>
      </button>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled || busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? "Preparing…" : "Choose File"}
          </Button>
          {selectedFile && (
            <Button
              type="button"
              size="sm"
              variant="default"
              disabled={disabled || busy}
              onClick={async () => {
                if (!selectedFile) return;
                setBusy(true);
                const result = await onUpload(selectedFile);
                setBusy(false);
                if (result && result.error) {
                  setError(result.error);
                } else {
                  // Update preview if URL returned
                  if (result && result.url) {
                    setPreview(result.url);
                  }
                  setSelectedFile(null);
                }
              }}
            >
              {busy ? "Uploading…" : "Save"}
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={disabled || busy || (!preview && !selectedFile)}
            onClick={async () => {
              setBusy(true);
              const result = await onRemove();
              setBusy(false);
              if (result && result.error) {
                setError(result.error);
              } else {
                setPreview(undefined);
                setSelectedFile(null);
              }
            }}
          >
            Remove
          </Button>
        </div>
        <p className="text-[11px] text-[#6B7280]">JPG, PNG, or WEBP. Max 2 MB.</p>
        {error && <p className="text-[11px] text-[#DC2626]">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
