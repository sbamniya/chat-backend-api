import { Pageable } from "../../types/page";
import prisma from "../../utils/prisma";
import validateRequest, { validateJWT } from "../../utils/validation";
import { CreateConversationDTO } from "./conversation.dto";

const getAllConversation = async (
  _: any,
  { limit = 10, page = 1 }: Pageable,
  ctx: any
) => {
  const user = validateJWT(ctx);
  const conversations = await prisma.conversation.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      OR: [
        {
          startedBy: user.id,
        },
        {
          participantIds: {
            has: user.id,
          },
        },
      ],
    },
    include: {
      messages: {
        select: {
          id: true,
          message: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return conversations;
};

const startNewConversation = async (
  _: any,
  { input }: { input: CreateConversationDTO },
  ctx: any
) => {
  const { id: senderId } = validateJWT(ctx);

  await validateRequest(CreateConversationDTO, input);

  const conversation = await prisma.conversation.create({
    data: {
      participantIds: [...input.receiverIds, senderId],
      startedBy: senderId,
    },
  });
  const message = await prisma.message.create({
    data: {
      message: input.message,
      senderId,
      conversationId: conversation.id,
    },
  });

  return { ...conversation, message };
};

const getMessageByConversation = async (
  _: any,
  { limit = 10, page = 1, id }: Pageable & { id: string },
  ctx: any
) => {
  const user = validateJWT(ctx);
  const messages = await prisma.message.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      conversationId: id,
      OR: [
        {
          senderId: user.id,
        },
        {
          conversation: {
            participantIds: {
              has: user.id,
            },
          },
        },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages;
};

const ConversationController = {
  getAllConversation,
  startNewConversation,
  getMessageByConversation,
};

export default ConversationController;
