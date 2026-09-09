"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center rounded-md border border-[#E5E7EB] bg-white p-0.5 text-[10px] sm:text-xs">
      <button
        onClick={() => setLanguage("en")}
        className={`rounded px-1.5 py-1 font-medium transition-colors sm:px-2 ${
          language === "en"
            ? "bg-[#142D52] text-white"
            : "text-[#6B7280] hover:text-[#142D52]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={`rounded px-1.5 py-1 font-medium transition-colors sm:px-2 ${
          language === "hi"
            ? "bg-[#142D52] text-white"
            : "text-[#6B7280] hover:text-[#142D52]"
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}