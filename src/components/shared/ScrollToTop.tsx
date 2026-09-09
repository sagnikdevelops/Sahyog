"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#142D52] text-white shadow-xl ring-2 ring-[#34D399]/60 hover:bg-[#047857] hover:scale-110 active:scale-95 transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
    >
      <ArrowUp className="h-5 w-5 text-[#34D399] transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
