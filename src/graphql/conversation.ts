import ConversationController from "./resolvers/conversation";

export const ConversationTypeDef = `
  scalar Date
  scalar JSON

  type MessageSender {
    id: String!
    username: String!
  }
  
  type ConversationMessage {
    id: String!
    message: String!
    sender: MessageSender!
    createdAt: Date!
  }
  type Conversation {
    id: String!
    messages: [ConversationMessage!]!
    startedBy: String!
    createdAt: Date!
    starter: User
    receivers: JSON
    participantIds: [String!]
  }

  type Query {
    allConversations(page: Int, limit: Int): [Conversation!]!
    messages(page: Int, limit: Int, id: String!): [ConversationMessage!]!
  }

  input ConversationInput {
    message: String
    receiverIds: [String!]!
  }

  type Mutation {
    createConversation(input: ConversationInput): Conversation  
  }
`;

export const ConversationQueries = {
  allConversations: ConversationController.getAllConversation,
  messages: ConversationController.getMessageByConversation,
};

export const ConversationMutation = {
  createConversation: ConversationController.startNewConversation,
};
