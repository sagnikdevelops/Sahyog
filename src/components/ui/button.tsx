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
          "bg-[#111111] text-white shadow hover:bg-[#262626]",
        destructive:
          "bg-[#DC2626] text-white shadow-sm hover:bg-[#B91C1C]",
        outline:
          "border border-[#E5E5E5] bg-white text-[#171717] shadow-sm hover:bg-[#F8F8F8] hover:text-[#111111]",
        secondary:
          "bg-[#F3F3F3] text-[#171717] shadow-sm hover:bg-[#E5E5E5]",
        ghost:
          "text-[#171717] hover:bg-[#F3F3F3] hover:text-[#111111]",
        link: "text-[#111111] underline-offset-4 hover:underline",
        emergency: "bg-[#DC2626] text-white font-semibold hover:bg-[#B91C1C] shadow-md",
        success: "bg-[#16A34A] text-white hover:bg-[#15803D]",
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