import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { Pageable } from "../../types/page";
import prisma from "../../utils/prisma";
import validateRequest, { validateJWT } from "../../utils/validation";
import { LoginDTO } from "./user.dto";

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
        issuer: "dripshop",
      }
    ),
    user,
  };
};

const signup = async (_: any, body: any) => {
  await validateRequest(LoginDTO, body);

  const { username, password } = body;
  const existingUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (existingUser) {
    throw new GraphQLError("User already exists.");
  }

  const user = await prisma.user.create({
    data: {
      username,
      password: hashSync(password, genSaltSync()),
    },
  });

  return {
    token: jwt.sign(
      {
        username,
        id: user?.id,
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: "24h",
        algorithm: "HS256",
        issuer: "dripshop",
      }
    ),
    user,
  };
};

const getAllUsers = (
  _: number,
  { page = 1, limit = 10, ids }: Pageable & { ids: string[] },
  ctx: any
) => {
  validateJWT(ctx);
  return prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: ids
      ? {
          id: {
            in: ids,
          },
        }
      : {},
  });
};

const UserController = {
  login,
  signup,
  getAllUsers,
};

export default UserController;
