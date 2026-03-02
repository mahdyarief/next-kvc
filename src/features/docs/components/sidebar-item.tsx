"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TocSection } from "../types";

export interface SidebarItemProps {
    section: TocSection;
    isOpen: boolean;
    onToggle: (id: string) => void;
    onScroll: (id: string, mobile: boolean) => void;
    isMobile: boolean;
}

export const SidebarItem = React.memo(
    ({
        section,
        isOpen,
        onToggle,
        onScroll,
        isMobile,
    }: SidebarItemProps) => (
        <div className="space-y-0.5">
            <button
                onClick={() =>
                    section.items.length > 0 ? onToggle(section.id) : onScroll(section.id, isMobile)
                }
                className="group flex w-full items-center justify-between py-1.5 text-left font-semibold text-foreground transition-colors hover:text-primary"
            >
                <span className="truncate pr-2 text-[13px]">{section.title}</span>
                {section.items.length > 0 && (
                    <ChevronRight
                        className={cn(
                            "h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40 transition-transform duration-200 group-hover:text-primary",
                            isOpen && "rotate-90"
                        )}
                    />
                )}
            </button>

            {isOpen && (
                <div className="ml-2.5 space-y-0.5 border-l border-border/60 pl-2.5">
                    {section.items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onScroll(item.id, isMobile)}
                            className="block w-full truncate rounded px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-primary"
                            title={item.text}
                        >
                            {item.text}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
);

SidebarItem.displayName = "SidebarItem";
