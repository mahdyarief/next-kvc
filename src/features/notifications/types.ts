import { 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Monitor 
} from "lucide-react";

export const NOTIFICATION_TYPES = [
  {
    value: "INFO",
    label: "Info",
    icon: Info,
    color: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  },
  {
    value: "WARNING",
    label: "Warning",
    icon: AlertTriangle,
    color: "bg-amber-500/10 border-amber-500/20 text-amber-500",
  },
  {
    value: "SUCCESS",
    label: "Success",
    icon: CheckCircle2,
    color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
  },
  {
    value: "SYSTEM",
    label: "System",
    icon: Monitor,
    color: "bg-violet-500/10 border-violet-500/20 text-violet-500",
  },
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]["value"];

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  href?: string;
  createdAt: string;
}
