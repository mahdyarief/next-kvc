"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { throttle } from "throttle-debounce";

// Constants for session inactivity
const ACTIVITY_KEY = "kvc_last_activity";
const INACTIVITY_TIMEOUT_MS = 3 * 60 * 60 * 1000; // 3 hours
const CHECK_INTERVAL_MS = 30 * 1000; // Check every 30 seconds
const THROTTLE_MS = 2000; // Only update localStorage max once every 2 seconds

export function useSessionTimeout() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session;
  
  // Use a ref to prevent stale closures in event listeners
  const isAuthenticatedRef = useRef(isAuthenticated);
  
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticatedRef.current) return;

    /**
     * Updates the last activity timestamp in localStorage.
     * Shared across all tabs instantly.
     */
    const updateActivity = throttle(THROTTLE_MS, () => {
      if (!isAuthenticatedRef.current) return;
      localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
    });

    /**
     * Checks if the time since last activity exceeds the timeout duration.
     */
    const checkTimeout = () => {
      if (!isAuthenticatedRef.current) return;

      const lastActivityStr = localStorage.getItem(ACTIVITY_KEY);
      if (!lastActivityStr) {
        // First run initialization
        updateActivity();
        return;
      }

      const lastActivity = parseInt(lastActivityStr, 10);
      const currentTime = Date.now();

      if (currentTime - lastActivity > INACTIVITY_TIMEOUT_MS) {
        console.warn("Session expired due to inactivity.");
        // Clear activity before logout to prevent instant re-logout loop
        localStorage.removeItem(ACTIVITY_KEY);
        // Force logout and redirect
        signOut({ callbackUrl: "/auth/sign-in" });
      }
    };

    // Events that signify actual user presence
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    // 1. Bind event listeners
    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // 2. Initialize timestamp
    updateActivity();

    // 3. Start the interval checker
    const intervalId = setInterval(checkTimeout, CHECK_INTERVAL_MS);

    // 4. Handle visibility change (e.g. they switch back to the tab after an hour)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkTimeout();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup phase
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      updateActivity.cancel();
    };
  }, [isAuthenticated]); // Only re-bind if authentication status initially changes
}
