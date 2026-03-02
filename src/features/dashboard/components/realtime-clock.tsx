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
      <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 opacity-50">
        <Clock className="h-4 w-4 text-slate-500" />
        <span>--:--:--</span>
        <span className="ml-1 border-l border-slate-300 pl-2 text-xs text-slate-400">
          {timezone}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
      <Clock className="h-4 w-4 text-slate-500" />
      <span>{time}</span>
      <span className="ml-1 border-l border-slate-300 pl-2 text-xs text-slate-400">{timezone}</span>
    </div>
  );
}
