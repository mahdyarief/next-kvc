import * as React from "react";
import { cn } from "@/lib/utils";
import { FloatingLabel } from "./label";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export interface FloatingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  showCount?: boolean;
}

const FloatingTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FloatingTextareaProps
>(({ id, label, className, showCount, maxLength, value, ...props }, ref) => {
  const generatedId = React.useId();
  const finalId = id || generatedId;

  const currentCount = React.useMemo(() => {
    if (typeof value === "string") return value.length;
    if (typeof value === "number") return value.toString().length;
    return 0;
  }, [value]);

  return (
    <div className="relative w-full space-y-1.5">
      <div className="relative">
        <Textarea
          {...props}
          id={finalId}
          value={value}
          maxLength={maxLength}
          placeholder=" "
          className={cn("peer min-h-[120px] px-3 py-3", className)}
          ref={ref}
        />
        <FloatingLabel htmlFor={finalId} id={finalId} className="top-6">
          {label}
        </FloatingLabel>
      </div>
      {(showCount || maxLength) && (
        <div className="flex justify-end px-1">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-widest uppercase">
            {currentCount}
            {maxLength ? ` / ${maxLength}` : ""} Characters
          </p>
        </div>
      )}
    </div>
  );
});
FloatingTextarea.displayName = "FloatingTextarea";

export { Textarea, FloatingTextarea };
