export type UserRole = "SUPERADMIN" | "OWNER" | "ADMIN" | "STAFF" | "CUSTOMER";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: string;
  status?: "online" | "offline";
  _count?: {
    sessions: number;
  };
}
