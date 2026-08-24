"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export function RatingStars({
  rating,
  maxRating = 5,
  interactive = false,
  onRatingChange,
  size = "md",
  showNumber = false,
}: RatingStarsProps) {
  const sizeClass = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  }[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              className={cn(
                "p-0.5 transition-transform",
                interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClass,
                  isFilled
                    ? "fill-[#111111] text-[#111111]"
                    : "text-[#D4D4D4] fill-[#F8F8F8]"
                )}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-[#171717] ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}