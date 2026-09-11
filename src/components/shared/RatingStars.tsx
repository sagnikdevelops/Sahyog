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
    <div
      className="flex items-center gap-1"
      role={!interactive ? "img" : undefined}
      aria-label={!interactive ? `Rating: ${rating.toFixed(1)} out of ${maxRating} stars` : undefined}
    >
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              aria-label={interactive ? `Rate ${starValue} out of ${maxRating} stars` : undefined}
              aria-pressed={interactive ? starValue <= rating : undefined}
              tabIndex={interactive ? 0 : -1}
              onClick={() => interactive && onRatingChange?.(starValue)}
              className={cn(
                "p-0.5 transition-transform",
                interactive ? "hover:scale-110 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#047857]" : "cursor-default"
              )}
            >
              <Star
                aria-hidden="true"
                className={cn(
                  sizeClass,
                  isFilled
                    ? "fill-[#047857] text-[#047857]"
                    : "text-[#D1D5DB] fill-[#F9FAF7]"
                )}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-[#1F2937] ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}