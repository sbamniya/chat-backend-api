import { createAdapter } from "@socket.io/redis-adapter";
import { IncomingMessage, Server, ServerResponse } from "http";
import { createClient } from "redis";
import { Socket, Server as SocketServer } from "socket.io";
import prisma from "../utils/prisma";
import validateConnection from "./validate";

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

  io.use(validateConnection);

  io.on("connection", (socket: Socket) => {
    const userId: string = String(socket.handshake.query.userId);
    const conversationId: string = String(
      socket.handshake.query.conversationId
    );

    console.log("User connected:", socket.id, userId, conversationId);

    socket.join(conversationId);

    socket.on("message", async ({ message }) => {
      const newMessage = await prisma.message.create({
        data: {
          message,
          conversationId,
          senderId: userId,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      io.to(conversationId).emit("newMessage", newMessage);
      // socket.emit("newMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socket.leave(conversationId);
    });
  });

  return io;
};

const SocketConnection = { init };

export default SocketConnection;
