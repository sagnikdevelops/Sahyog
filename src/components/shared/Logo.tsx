import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  priority?: boolean;
}

const sizeMap = {
  xs: { img: 20, box: "w-6 h-6", text: "text-xs" },
  sm: { img: 28, box: "w-8 h-8", text: "text-sm" },
  md: { img: 36, box: "w-10 h-10", text: "text-base sm:text-lg" },
  lg: { img: 48, box: "w-12 h-12", text: "text-lg sm:text-xl" },
  xl: { img: 64, box: "w-16 h-16", text: "text-xl sm:text-2xl" },
};

export function SahyogLogo({ className = "", size = "md", showText = false, priority = false }: LogoProps) {
  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-white p-0.5 shadow-sm border border-[#E5E7EB] shrink-0 overflow-hidden ${currentSize.box}`}>
        <Image
          src="/images/logo.png"
          alt="Sahyog Logo"
          width={currentSize.img}
          height={currentSize.img}
          className="object-contain w-full h-full"
          priority={priority}
        />
      </div>
      {showText && (
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-[#142D52] ${currentSize.text}`}>Sahyog</span>
          </div>

        </div>
      )}
    </div>
  );
}
