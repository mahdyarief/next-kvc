import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 32, showText = false }: LogoProps) {
  const fontSize = Math.max(Math.floor(size * 0.4), 11);

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {/* Logomark — vibrant blue gradient */}
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-[0.6em] flex-shrink-0"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, oklch(0.62 0.18 255), oklch(0.48 0.22 265))",
          boxShadow: "0 1px 4px oklch(0.55 0.2 260 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.15)",
        }}
      >
        {/* Subtle gloss overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[0.6em]"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 55%)",
          }}
        />
        <span
          className="relative z-10 font-bold tracking-tight text-white"
          style={{ fontSize, letterSpacing: "-0.03em" }}
        >
          NS
        </span>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-heading text-foreground font-semibold tracking-tight" style={{ fontSize: size * 0.42 }}>
            NextKVC
          </span>
          <span className="text-muted-foreground font-mono tracking-widest uppercase" style={{ fontSize: size * 0.22 }}>
            Dashboard
          </span>
        </div>
      )}
    </div>
  );
}
