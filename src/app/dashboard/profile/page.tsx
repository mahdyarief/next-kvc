import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileService } from "@/features/profile/services/profile.service";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ApiKeyManager } from "@/features/profile/components/api-key-manager";

export default async function UserProfilePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/sign-in");

    const profile = await ProfileService.getProfile(session.user.id);
    if (!profile) redirect("/dashboard");

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 backdrop-blur-sm">
                    <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-outfit text-3xl font-bold tracking-tight">
                            My Profile
                        </h1>
                        <div className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3" />
                            Active
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Update your personal details and manage your authentication credentials
                    </p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-5">
                {/* Main Profile Info — left/wider column */}
                <div className="xl:col-span-3">
                    <ProfileForm
                        initialData={{
                            name: profile.name || "",
                            email: profile.email || "",
                            role: profile.role,
                        }}
                    />
                </div>

                {/* Credentials & API — right column */}
                <div className="xl:col-span-2 space-y-6">
                    <ApiKeyManager initialKey={profile.apiKey} />

                    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <User className="h-24 w-24" />
                        </div>
                        <div className="relative space-y-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Account Metadata</p>
                                <div className="mt-3 space-y-2.5">
                                    <MetadataRow label="Member Since" value={new Date(profile.createdAt).toLocaleDateString()} />
                                    <MetadataRow label="Last Update" value={new Date(profile.updatedAt).toLocaleDateString()} />
                                    <MetadataRow label="User ID" value={profile.id} mono />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetadataRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className={cn("font-semibold", mono && "font-mono text-[10px] bg-muted/50 px-1.5 py-0.5 rounded")}>
                {value}
            </span>
        </div>
    );
}
