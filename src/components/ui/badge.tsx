import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#111111] text-white shadow hover:bg-[#262626]",
        secondary:
          "border-transparent bg-[#F3F3F3] text-[#171717] hover:bg-[#E5E5E5]",
        outline: "border-[#E5E5E5] text-[#171717]",
        success: "border-transparent bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20",
        warning: "border-transparent bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20",
        destructive: "border-transparent bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20",
        info: "border-transparent bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20",
        cooperative: "border-transparent bg-[#111111] text-white font-medium",
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