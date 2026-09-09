import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#142D52] text-white shadow-sm hover:bg-[#0E203B]",
        emerald:
          "border-transparent bg-[#047857] text-white shadow-sm hover:bg-[#065F46]",
        mint:
          "border border-[#34D399]/40 bg-[#34D399]/15 text-[#047857]",
        secondary:
          "border border-[#E5E7EB] bg-[#F9FAF7] text-[#142D52] hover:bg-white",
        outline: "border-[#E5E7EB] text-[#1F2937]",
        success: "border border-[#047857]/20 bg-[#047857]/10 text-[#047857]",
        warning: "border border-[#D97706]/20 bg-[#D97706]/10 text-[#D97706]",
        destructive: "border border-[#DC2626]/20 bg-[#DC2626]/10 text-[#DC2626]",
        info: "border border-[#142D52]/20 bg-[#142D52]/10 text-[#142D52]",
        cooperative: "border border-[#047857]/30 bg-[#047857] text-white font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };