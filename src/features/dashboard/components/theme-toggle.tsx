"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-transparent">
                <div className="h-4 w-4 rounded-full bg-muted/50 animate-pulse" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-xl border border-border/20 bg-background/50 transition-all duration-300 hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} className="w-44 p-1.5 glass-panel">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className={cn(
                        "flex items-center justify-between gap-2 px-2.5 py-2 cursor-pointer rounded-lg transition-colors",
                        theme === "light" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                    )}
                >
                    <div className="flex items-center gap-2.5">
                        <Sun className="h-4 w-4" />
                        <span className="text-sm font-medium">Light</span>
                    </div>
                    {theme === "light" && <Check className="h-3.5 w-3.5" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className={cn(
                        "flex items-center justify-between gap-2 px-2.5 py-2 cursor-pointer rounded-lg transition-colors",
                        theme === "dark" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                    )}
                >
                    <div className="flex items-center gap-2.5">
                        <Moon className="h-4 w-4" />
                        <span className="text-sm font-medium">Dark</span>
                    </div>
                    {theme === "dark" && <Check className="h-3.5 w-3.5" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className={cn(
                        "flex items-center justify-between gap-2 px-2.5 py-2 cursor-pointer rounded-lg transition-colors",
                        theme === "system" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                    )}
                >
                    <div className="flex items-center gap-2.5">
                        <Monitor className="h-4 w-4" />
                        <span className="text-sm font-medium">System</span>
                    </div>
                    {theme === "system" && <Check className="h-3.5 w-3.5" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
