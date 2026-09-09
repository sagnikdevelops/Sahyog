import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#047857] text-white shadow-sm hover:bg-[#065F46] focus-visible:ring-[#34D399]",
        navy:
          "bg-[#142D52] text-white shadow hover:bg-[#0E203B] focus-visible:ring-[#047857]",
        destructive:
          "bg-[#DC2626] text-white shadow-sm hover:bg-[#B91C1C]",
        outline:
          "border border-[#E5E7EB] bg-white text-[#1F2937] shadow-sm hover:bg-[#F9FAF7] hover:text-[#047857] hover:border-[#047857]/40",
        secondary:
          "bg-[#F9FAF7] text-[#142D52] border border-[#E5E7EB] shadow-sm hover:bg-[#34D399]/15 hover:border-[#34D399]/40",
        ghost:
          "text-[#1F2937] hover:bg-[#F9FAF7] hover:text-[#047857]",
        link: "text-[#047857] underline-offset-4 hover:underline hover:text-[#142D52]",
        emergency: "bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] shadow-md",
        success: "bg-[#047857] text-white hover:bg-[#065F46]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };