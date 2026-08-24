"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center rounded-md border border-[#E5E5E5] bg-white p-0.5 text-xs">
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 rounded transition-colors font-medium ${
          language === "en"
            ? "bg-[#111111] text-white"
            : "text-[#737373] hover:text-[#111111]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={`px-2 py-1 rounded transition-colors font-medium ${
          language === "hi"
            ? "bg-[#111111] text-white"
            : "text-[#737373] hover:text-[#111111]"
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}