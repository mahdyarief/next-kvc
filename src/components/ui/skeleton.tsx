import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
};
Skeleton.displayName = "Skeleton";

export { Skeleton };
