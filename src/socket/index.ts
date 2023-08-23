import { IncomingMessage, Server, ServerResponse } from "http";
import { Server as SocketServer } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const init = async (
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  const io = new SocketServer(server, {
    transports: ["websocket", "polling"], // Allow WebSocket and long polling
  });

  const pubClient = createClient({
    url: process.env.REDIS_URL,
  });

  const subClient = pubClient.duplicate();

  pubClient.on("error", (error) => {
    console.log("Redis pubClient error:", error);
  });

  pubClient.on("connect", async () => {
    console.log("Redis pubClient connected");
  });

  subClient.on("error", (error) => {
    console.log("Redis subClient error:", error);
  });

  subClient.on("connect", async () => {
    console.log("Redis subClient connected");
  });

  await Promise.all([pubClient.connect(), subClient.connect()]);

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const SocketConnection = { init };

export default SocketConnection;
