import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Page Not Found",
};

export default function NotFound() {
    return (
        <div className="flex min-h-[85vh] flex-col items-center justify-center px-6 py-24 text-center selection:bg-primary/20 selection:text-primary">
            <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center">
                {/* Playful visual element */}
                <div className="bg-primary/5 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-primary/10 mb-8 relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-[24px] group-hover:bg-primary/30 transition-all duration-500 rounded-[2rem]" />
                    <FileQuestion className="h-10 w-10 text-primary relative z-10" />
                </div>

                {/* Text content */}
                <h1 className="font-outfit text-7xl font-extrabold tracking-tight sm:text-9xl mb-2 text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/30">
                    404
                </h1>

                <h2 className="font-outfit text-2xl font-bold tracking-tight sm:text-4xl mb-4 text-foreground">
                    Page Not Found
                </h2>

                <p className="text-muted-foreground max-w-[420px] text-base sm:text-lg mb-10 leading-relaxed">
                    The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Button asChild size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 px-8 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 border border-transparent">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2 rounded-xl h-12 px-8 bg-background/50 backdrop-blur-md hover:bg-muted/50 border-border/50 transition-all">
                        <Link href="/dashboard">
                            Dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
