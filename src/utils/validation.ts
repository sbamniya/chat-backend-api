import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { GraphQLError } from "graphql";

async function validateRequest(
  type: any,
  body: any = {},
  skipMissingProperties = false
) {
  const errors = await validate(plainToInstance(type, body), {
    skipMissingProperties,
  });

  if (errors.length > 0) {
    throw new GraphQLError(
      errors
        .map(({ constraints }) => Object.values(constraints as any).join("\n"))
        .join("\n")
    );
  }
  return false;
}

export function validateJWT(ctx: any) {
  if (!ctx.jwt) {
    throw new GraphQLError("JWT required.");
  }
  return ctx.jwt;
}

export default validateRequest;
