"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    Code,
    Laptop,
    Moon,
    Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

interface SearchCommandProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const SearchCommand = ({ open: controlledOpen, onOpenChange }: SearchCommandProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { setTheme } = useTheme();

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : open;

    const setIsOpen = useCallback((value: boolean | ((old: boolean) => boolean)) => {
        if (isControlled && onOpenChange) {
            const newValue = typeof value === 'function' ? value(controlledOpen) : value;
            onOpenChange(newValue);
        } else {
            setOpen(value);
        }
    }, [isControlled, onOpenChange, controlledOpen]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            const isK = e.key.toLowerCase() === "k";
            const isStandard = isK && (e.metaKey || e.ctrlKey);
            const isAltCombo = isK && e.ctrlKey && e.altKey;

            if (isStandard || isAltCombo) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [setIsOpen]);

    const runCommand = useCallback((command: () => void) => {
        setIsOpen(false);
        command();
    }, [setIsOpen]);

    return (
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList className="styled-scrollbar">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
                        <LayoutDashboard />
                        <span>Dashboard</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/users"))}>
                        <Users />
                        <span>Users</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
                        <Settings />
                        <span>Settings</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Developer">
                    <CommandItem onSelect={() => runCommand(() => router.push("/docs"))}>
                        <FileText />
                        <span>API Docs</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => window.open("/swagger", "_blank"))}>
                        <Code />
                        <span>Swagger UI</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Theme">
                    <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                        <Sun />
                        <span>Light Mode</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                        <Moon />
                        <span>Dark Mode</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                        <Laptop />
                        <span>System Mode</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
