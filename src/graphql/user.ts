import UserController from "../controller/user";
import { Pageable } from "../types/page";
import prisma from "../utils/prisma";
import { validateJWT } from "../utils/validation";

export const UserTypeDef = `
  type User {
    id: String!
    username: String!
    password: String
  }

  type Query {
    allUsers(page: Int, limit: Int): [User!]!
  }

  type LoginResponse {
    token: String!
    user: User
  }

  type Mutation {
    login(username: String!, password: String!): LoginResponse  
  }
`;

export const UserQueries = {
  allUsers: (_: number, { page = 1, limit = 10 }: Pageable, ctx: any) => {
    validateJWT(ctx);
    return prisma.user.findMany();
  },
};

export const UserMutation = {
  login: UserController.login,
};
