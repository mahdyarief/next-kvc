import Link from "next/link";
import { Github } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
    className?: string;
    maxContentWidth?: string;
}

export function SiteFooter({ className, maxContentWidth = "max-w-6xl" }: SiteFooterProps) {
    return (
        <footer className={cn("border-t border-border/60 py-10 print:hidden", className)}>
            <div className={cn("mx-auto px-6", maxContentWidth)}>
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="transition-opacity hover:opacity-80">
                            <Logo size={32} showText={false} />
                        </Link>
                        <div className="flex flex-wrap gap-5">
                            <Link
                                href="/#features"
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="/docs"
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Docs
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Terms
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="https://github.com/kelasvibecoding/next-kvc"
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Github className="h-4 w-4" />
                        </Link>
                        <span className="text-muted-foreground text-xs">
                            © {new Date().getFullYear()} NextStarter
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
