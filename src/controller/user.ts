import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import validateRequest from "../utils/validation";
import { LoginDTO } from "./user.dto";
import { GraphQLError } from "graphql";

const login = async (_: any, body: any) => {
  await validateRequest(LoginDTO, body);

  const { username, password } = body;
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user || !compareSync(password, user.password || "")) {
    throw new GraphQLError("Incorrect username or password.");
  }

  return {
    token: jwt.sign(
      {
        username,
        id: user?.id,
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: "2h",
        algorithm: "HS256",
        issuer: "dripshop"
      }
    ),
    user,
  };
};

const UserController = {
  login,
};

export default UserController;
