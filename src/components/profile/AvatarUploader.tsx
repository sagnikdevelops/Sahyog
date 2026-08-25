"use client";

import React, { useRef, useState } from "react";
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
  onUpload: (file: File) => Promise<{ error?: string } | void>;
  onRemove: () => Promise<{ error?: string } | void>;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(url);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setBusy(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    const result = await onUpload(file);
    setBusy(false);
    if (result && result.error) {
      setError(result.error);
      setPreview(url);
    }
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
          <Button type="button" size="sm" variant="outline" disabled={disabled || busy} onClick={() => inputRef.current?.click()}>
            {busy ? "Uploading…" : "Upload"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={disabled || busy || !preview}
            onClick={async () => {
              setBusy(true);
              const result = await onRemove();
              setBusy(false);
              if (result && result.error) setError(result.error);
              else setPreview(undefined);
            }}
          >
            Remove
          </Button>
        </div>
        <p className="text-[11px] text-[#737373]">JPG, PNG, or WEBP. Max 2 MB.</p>
        {error ? <p className="text-[11px] text-[#DC2626]">{error}</p> : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
