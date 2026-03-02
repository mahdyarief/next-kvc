"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelect: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            <button
                onClick={() => onSelect("All")}
                className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
                    selectedCategory === "All"
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                )}
            >
                All Endpoints
            </button>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
                        selectedCategory === cat
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
