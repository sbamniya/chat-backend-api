import UserController from "./resolvers/user";

export const UserTypeDef = `
  type User {
    id: String!
    username: String!
    password: String
  }

  type Query {
    allUsers(page: Int, limit: Int, ids: [String]): [User!]!
  }

  type AuthResponse {
    token: String!
    user: User
  }

  type Mutation {
    login(username: String!, password: String!): AuthResponse  
    signup(username: String!, password: String!): AuthResponse  
  }
`;

export const UserQueries = {
  allUsers: UserController.getAllUsers,
};

export const UserMutation = {
  login: UserController.login,
  signup: UserController.signup,
};
