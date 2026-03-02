"use client";

import { useEffect, useState } from "react";
import moment from "moment-timezone";
import { Clock } from "lucide-react";

export function RealtimeClock() {
  const [time, setTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch global timezone
    fetch("/api/settings/system")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.timezone) {
          setTimezone(data.timezone);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateTime = () => {
      setTime(moment().tz(timezone).format("HH:mm:ss"));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone, mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/40 px-3 py-1.5 text-[13px] font-semibold text-muted-foreground/60 opacity-50 backdrop-blur-sm shadow-sm transition-all duration-300">
        <Clock className="h-4 w-4" />
        <span className="font-mono tracking-wider">--:--:--</span>
        <span className="ml-1 border-l border-border/40 pl-2 text-[10px] font-bold uppercase tracking-widest">{timezone}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/50 px-3 py-1.5 text-[13px] font-bold text-foreground/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-muted group">
      <Clock className="h-4 w-4 text-primary transition-colors group-hover:text-primary/70" />
      <span className="font-mono tracking-wider tabular-nums">{time}</span>
      <span className="ml-1 border-l border-border/40 pl-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{timezone}</span>
    </div>
  );
}
