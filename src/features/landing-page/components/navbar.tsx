"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "Docs", href: "/docs" },
        { label: "GitHub", href: "https://github.com/kelasvibecoding/next-kvc", icon: Github },
    ];

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-all duration-300 px-4 pt-4 sm:px-8 sm:pt-6",
                scrolled ? "pt-2" : "pt-4 sm:pt-6"
            )}
        >
            <div className={cn(
                "glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-xl px-4 sm:px-6 transition-all duration-300",
                scrolled && "shadow-lg shadow-primary/5 border-primary/10"
            )}>
                <Link href="/" className="transition-opacity hover:opacity-80">
                    <Logo size={32} showText={true} />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium transition-colors"
                        >
                            {link.icon && <link.icon className="h-4 w-4" />}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link href="/auth/sign-in" className="hidden sm:block">
                        <Button variant="ghost" size="sm" className="text-sm font-medium">Sign In</Button>
                    </Link>
                    <Link href="/auth/sign-up">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 rounded-lg px-4 text-sm font-semibold shadow-sm transition-all">
                            Get Started
                        </Button>
                    </Link>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden h-9 w-9"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "lg:hidden absolute inset-x-4 top-20 z-50 overflow-hidden transition-all duration-300 ease-in-out",
                mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="glass flex flex-col gap-4 rounded-xl p-6 shadow-2xl border-primary/10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-foreground flex items-center gap-2 text-lg font-semibold border-b border-primary/5 pb-2 last:border-0"
                        >
                            {link.icon && <link.icon className="h-5 w-5" />}
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/auth/sign-in" className="sm:hidden mt-2">
                        <Button variant="outline" className="w-full justify-center h-11 font-bold">Sign In</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
