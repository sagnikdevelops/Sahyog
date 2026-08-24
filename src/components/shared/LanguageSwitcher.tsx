"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center rounded-md border border-[#E5E5E5] bg-white p-0.5 text-[10px] sm:text-xs">
      <button
        onClick={() => setLanguage("en")}
        className={`rounded px-1.5 py-1 font-medium transition-colors sm:px-2 ${
          language === "en"
            ? "bg-[#111111] text-white"
            : "text-[#737373] hover:text-[#111111]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={`rounded px-1.5 py-1 font-medium transition-colors sm:px-2 ${
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