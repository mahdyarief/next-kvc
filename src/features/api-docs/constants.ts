import { ApiEndpoint } from "./types";

export const API_ENDPOINTS: ApiEndpoint[] = [
  // Authentication
  {
    category: "Authentication",
    method: "POST",
    path: "/api/auth/register",
    description: "Register a new user account",
    params: "Body: { name, email, password }",
    auth: "PUBLIC",
  },
  {
    category: "Authentication",
    method: "POST",
    path: "/api/auth/signin",
    description: "Sign in with credentials",
    params: "Body: { email, password }",
    auth: "PUBLIC",
  },
  {
    category: "Authentication",
    method: "POST",
    path: "/api/auth/signout",
    description: "Sign out and clear session",
    params: "-",
    auth: "PUBLIC",
  },

  // User Management
  {
    category: "Users",
    method: "GET",
    path: "/api/users",
    description: "List all users with pagination",
    params: "Query: ?page=1&limit=10",
    auth: "ADMIN",
  },
  {
    category: "Users",
    method: "POST",
    path: "/api/users",
    description: "Create a new user manually",
    params: "Body: { name, email, password, role }",
    auth: "ADMIN",
  },
  {
    category: "Users",
    method: "PATCH",
    path: "/api/users/[id]",
    description: "Update user details or role",
    params: "Path: id, Body: { name, role, ... }",
    auth: "ADMIN",
  },
  {
    category: "Users",
    method: "DELETE",
    path: "/api/users/[id]",
    description: "Delete a user account",
    params: "Path: id",
    auth: "ADMIN",
  },

  // Profile
  {
    category: "Profile",
    method: "GET",
    path: "/api/user/profile",
    description: "Get authenticated user profile",
    params: "-",
    auth: "USER",
  },
  {
    category: "Profile",
    method: "PATCH",
    path: "/api/user/profile",
    description: "Update own profile settings",
    params: "Body: { name, password, image }",
    auth: "USER",
  },

  // System Settings
  {
    category: "Settings",
    method: "GET",
    path: "/api/settings/system",
    description: "Read global system configuration",
    params: "-",
    auth: "SUPERADMIN",
  },
  {
    category: "Settings",
    method: "POST",
    path: "/api/settings/system",
    description: "Update global system settings",
    params: "Body: { appName, logoUrl, timezone, enableRegistration }",
    auth: "SUPERADMIN",
  },

  // Storage
  {
    category: "Storage",
    method: "POST",
    path: "/api/storage/upload",
    description: "Upload a file to cloud or local storage",
    params: "Body: { file } (multipart/form-data)",
    auth: "USER",
  },
  {
    category: "Storage",
    method: "DELETE",
    path: "/api/storage/[id]",
    description: "Delete an existing file",
    params: "Path: id",
    auth: "USER",
  },

  // Notifications
  {
    category: "Notifications",
    method: "GET",
    path: "/api/notifications",
    description: "List user notifications",
    params: "Query: ?unreadOnly=boolean",
    auth: "USER",
  },
  {
    category: "Notifications",
    method: "PATCH",
    path: "/api/notifications/read-all",
    description: "Mark all notifications as read",
    params: "-",
    auth: "USER",
  },

  // Health
  {
    category: "System",
    method: "GET",
    path: "/api/system/status",
    description: "Check system and DB health status",
    params: "-",
    auth: "PUBLIC",
  },
];
