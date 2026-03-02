import dotenv from "dotenv";
dotenv.config({ override: true });
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { setupSocket } from "./socket";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3030", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(server, {
    path: "/api/socket/io",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setupSocket(io);
  // Optional: Global instance to emit events (e.g. notifications)
  (globalThis as unknown as Record<string, unknown>).io = io;

  server.listen(port, () => {

    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
