"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { NotificationComposer } from "@/features/notifications/components/notification-composer";
import { NotificationLivePreview } from "@/features/notifications/components/notification-live-preview";
import { NotificationType } from "@/features/notifications/types";

export default function NotificationAdminPage() {
  const [previewData, setPreviewData] = useState({
    title: "",
    message: "",
    type: "INFO" as NotificationType,
    broadcast: true,
    href: "",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 backdrop-blur-sm">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight">
            Notification Manager
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Compose and dispatch alerts to users or system-wide
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Composer — left column */}
        <div className="xl:col-span-3">
          <NotificationComposer
            onDataChange={(data) => setPreviewData(data)}
          />
        </div>

        {/* Preview — right column */}
        <div className="xl:col-span-2">
          <NotificationLivePreview data={previewData} />
        </div>
      </div>
    </div>
  );
}
