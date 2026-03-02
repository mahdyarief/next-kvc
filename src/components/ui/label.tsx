"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export interface FloatingLabelProps
  extends React.ComponentPropsWithoutRef<typeof Label> {
  id: string;
}

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FloatingLabelProps
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        "bg-background absolute start-2 z-10 origin-[0] transform px-2 text-sm text-gray-500 transition-all duration-300",
        // Peer logic (for Input, Textarea)
        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
        "peer-focus:text-foreground peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2",
        // Manual "Always up" logic (for Select or when field has value)
        "not-peer-placeholder-shown:top-2 not-peer-placeholder-shown:-translate-y-4 not-peer-placeholder-shown:scale-75",
        "pointer-events-none cursor-text",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = "FloatingLabel";

export { Label, FloatingLabel };
