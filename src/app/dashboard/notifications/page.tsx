"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NotificationAdminPage() {
  // Note: Server-side protection is also needed.
  // For now assuming Layout or Middleware handles role check, or API sends 403.

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("INFO");
  const [broadcast, setBroadcast] = useState(true);
  const [targetUserId, setTargetUserId] = useState("");
  const [href, setHref] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !message) return toast.error("Title and Message are required");
    if (!broadcast && !targetUserId)
      return toast.error("Target User ID is required for non-broadcast");

    setLoading(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          type,
          broadcast,
          targetUserId: broadcast ? undefined : targetUserId,
          href,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        const count = result.data?.count || 1;
        toast.success(result.message || `Notification sent successfully! (Count: ${count})`);
        // Reset form
        setTitle("");
        setMessage("");
        setHref("");
      } else {
        const result = await res.json();
        toast.error(result.message || "Failed to send notification");
      }
    } catch {
      toast.error("Error sending notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Bell className="h-8 w-8" /> Notification Manager
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compose Notification</CardTitle>
            <CardDescription>Send alerts to users or system-wide broadcasts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. System Maintenance"
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detailed message..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="WARNING">Warning</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="SYSTEM">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Action Link (Optional)</Label>
                <Input
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  placeholder="/dashboard/settings"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Switch id="broadcast" checked={broadcast} onCheckedChange={setBroadcast} />
              <Label htmlFor="broadcast">Broadcast to ALL Users</Label>
            </div>

            {!broadcast && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                <Label>Target User ID</Label>
                <Input
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="User ID (cuid)"
                />
              </div>
            )}

            <div className="pt-4">
              <Button className="w-full" onClick={handleSend} disabled={loading}>
                {loading ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Notification
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-dashed bg-muted/40">
            <CardHeader>
              <CardTitle className="text-muted-foreground font-heading text-sm font-semibold uppercase tracking-wider">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="surface flex items-start gap-4 p-5 transition-all duration-300">
                <div
                  className={cn(
                    "flex-shrink-0 rounded-xl p-2.5 border border-primary/20 bg-primary/10 text-primary",
                    type === "WARNING" && "border-amber-500/20 bg-amber-500/10 text-amber-500",
                    type === "SUCCESS" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
                  )}
                >
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading text-sm font-semibold leading-none">{title || "Notification Title"}</h4>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
                    {message || "Notification message content will appear here."}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-muted-foreground/40 text-[10px] font-medium uppercase tracking-widest">Just now</p>
                    <div className="bg-primary/20 h-1.5 w-1.5 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
