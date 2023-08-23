import { Pageable } from "../types/page";
import prisma from "../utils/prisma";
import validateRequest, { validateJWT } from "../utils/validation";
import { CreateConversationDTO } from "./conversation.dto";

const getAllConversation = async (
  _: any,
  { limit = 10, page = 1 }: Pageable
) => {
  return prisma.conversation.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
};

const startNewConversation = async (
  _: any,
  { input }: { input: CreateConversationDTO },
  ctx: any
) => {
  const { id: senderId } = validateJWT(ctx);

  await validateRequest(CreateConversationDTO, input);
  console.log(senderId);

  const conversation = await prisma.conversation.create({
    data: {
      participantIds: input.receiverIds,
      starter: senderId,
    },
  });
  await prisma.message.create({
    data: {
      message: input.message,
      senderId,
      conversationId: conversation.id,
      receivers: input.receiverIds.map((id) => ({ id, read: false })),
    },
  });
  
  return conversation;
};

const ConversationController = {
  getAllConversation,
  startNewConversation,
};

export default ConversationController;
