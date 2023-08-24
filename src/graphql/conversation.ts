import ConversationController from "./resolvers/conversation";

export const ConversationTypeDef = `
  scalar Date
  scalar JSON

  type Conversation {
    id: String!
    message: String!
    startedBy: String!
    createdAt: Date!
    starter: User
    receivers: JSON
  }

  type Query {
    allConversations: [Conversation!]!
  }

  input ConversationInput {
    message: String!
    receiverIds: [String!]!
  }

  type Mutation {
    createConversation(input: ConversationInput): Conversation  
  }
`;

export const ConversationQueries = {
  allConversations: ConversationController.getAllConversation,
};

export const ConversationMutation = {
  createConversation: ConversationController.startNewConversation,
};
