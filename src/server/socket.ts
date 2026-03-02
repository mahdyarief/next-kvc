import { Server } from "socket.io";

/**
 * Tracks online users by their IDs and socket connections.
 */
export const onlineUsers = new Map<string, Set<string>>();

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    // console.log("Client connected:", socket.id);

    // Track the user ID associated with this socket
    let currentUserId: string | null = null;

    socket.on("disconnect", () => {
      // console.log("Client disconnected:", socket.id);
      if (currentUserId) {
        const sockets = onlineUsers.get(currentUserId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            onlineUsers.delete(currentUserId);
            // Optional: Broadcast "User Offline" to other admins
            io.emit("user:status", { userId: currentUserId, status: "offline" });
          }
        }
      }
    });

    // Handle joining user-specific room for notifications & tracking online status
    socket.on("join-user-room", (userId: string) => {
      currentUserId = userId;
      socket.join(`user:${userId}`);
      
      // Add to online tracking
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
        // Broadcast "User Online"
        io.emit("user:status", { userId, status: "online" });
      }
      onlineUsers.get(userId)?.add(socket.id);
      
      // console.log(`Socket ${socket.id} joined user room: user:${userId}`);
    });

    // Handle joining room for specific WA session
    socket.on("join-session", (sessionId: string) => {
      socket.join(sessionId);
    });
  });

  // Attach a helper to get online status
  (io as Server & { getOnlineUsers: () => string[] }).getOnlineUsers = () => Array.from(onlineUsers.keys());
}
