import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 32, showText = false }: LogoProps) {
  const fontSize = Math.max(Math.floor(size * 0.45), 12);

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className="from-primary shadow-primary/20 group relative flex items-center justify-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br via-blue-600 to-indigo-700 shadow-xl"
        style={{ width: size, height: size }}
      >
        {/* Dynamic Pulse Background */}
        <div className="animate-pulse-glow absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        {/* Decorative Accents */}
        <div className="absolute top-0 right-0 h-1/2 w-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-xl" />
        <div className="absolute bottom-0 left-0 h-1/2 w-1/2 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/20 blur-xl" />

        {/* The "NEXT" Text Logo */}
        <span
          className="relative z-10 font-black tracking-[-0.05em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          style={{ fontSize: fontSize }}
        >
          NS
        </span>

        {/* Premium Glossy Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/25" />
        <div className="pointer-events-none absolute inset-[1px] rounded-[1.2rem] border border-white/20" />
      </div>

      {showText && (
        <div className="flex flex-col -space-y-1">
          <span className="text-foreground text-2xl font-black tracking-tighter italic">
            NEXT
            <span className="text-primary decoration-primary/20 underline underline-offset-4 opacity-90">
              STARTER
            </span>
          </span>
          <div className="flex items-center gap-1.5 opacity-60">
            <div className="bg-muted-foreground h-[1px] w-2" />
            <span className="text-muted-foreground text-[10px] font-black tracking-[0.25em] uppercase">
              Application
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
