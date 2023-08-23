import { genSaltSync, hashSync } from "bcrypt";
import { createSchema } from "graphql-yoga";
import prisma from "../utils/prisma";
import {
  ConversationMutation,
  ConversationQueries,
  ConversationTypeDef,
} from "./conversation";
import { UserMutation, UserQueries, UserTypeDef } from "./user";

const resolvers = {
  Query: {
    ...UserQueries,
    ...ConversationQueries,
  },
  Mutation: {
    ...ConversationMutation,
    ...UserMutation
  },
};

const typeDefs = [UserTypeDef, ConversationTypeDef].join("\n");

export const schema = createSchema({
  resolvers,
  typeDefs,
});

async function seedUser() {
  const username = "username";

  const existingUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (existingUser) {
    return;
  }

  const password = hashSync("password", genSaltSync());

  await prisma.user.create({
    data: {
      username,
      password,
    },
  });
}

seedUser();
