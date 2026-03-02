/**
 * Application Constants
 */

/**
 * Socket.IO Configuration
 */
export const SOCKET_CONFIG = {
  PATH: "/api/socket/io",
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  NOTIFICATION_LIMIT: 300, // Max notifications kept in view
} as const;

/**
 * Roles
 */
export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  OWNER: "OWNER",
  STAFF: "STAFF",
} as const;
