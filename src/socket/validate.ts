import { Socket } from "socket.io";

const validateConnection = (socket: Socket, next: any) => {
  const userId: string = String(socket.handshake.query.userId);
  const conversationId: string = String(socket.handshake.query.conversationId);
  if (!userId || !conversationId) {
    throw new Error("conversationId and userId are required to connect socket");
  }
  next();
};

export default validateConnection