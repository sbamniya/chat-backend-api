import dotenv from "dotenv";
dotenv.config();

import { useJWT } from "@graphql-yoga/plugin-jwt";
import cors from "cors";
import express, { Application } from "express";
import { createYoga } from "graphql-yoga";
import http from "http";
import { schema } from "./graphql";
import SocketConnection from "./socket";

const app: Application = express();

const PORT: number = Number(process.env.PORT || "8000");

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

if (!process.env.DATABASE_URL) {
  console.log("`DATABASE_URL` is missing in env variable");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.log("`JWT_SECRET` is missing in env variable");
  process.exit(1);
}

SocketConnection.init(server)
  .then((io) => {
    app.set("io", io);

    const yoga = createYoga({
      schema,
      cors: {
        origin: "*",
      },
      healthCheckEndpoint: "/live",
      graphqlEndpoint: "/graphql",
      plugins: [
        useJWT({
          issuer: "dripshop",
          signingKey: String(process.env.JWT_SECRET),
          algorithms: ["HS256"],
        }),
      ],
    });

    // Bind GraphQL Yoga to the graphql endpoint to avoid rendering the playground on any path
    app.use(yoga.graphqlEndpoint, yoga);

    server.listen(PORT, (): void => {
      console.log("🚀 Server is up on port %d", PORT);
    });
  })
  .catch((err) => {
    console.error("An error occurred while setting socket.", err);
  });
