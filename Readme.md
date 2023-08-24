# Chat App UI

Node + Express + TypeScript application.

## Features

- NodeJS application with TypeScript and Express
- Supports socket.io for real time communication
- Uses redis to make the socket connection stateless.
- Uses Prisma as ORM.
- Postgres is used as databases.
- Graphql protocol support with `graphql-yoga`
- Authentication with JWT with `@graphql-yoga/plugin-jwt`
- `class-validator` for validation.

Application uses `pnpm` to install dependencies.

## Start Development Server

### Install dependencies

```sh
pnpm install
```

or

```sh
pnpm i
```

### Run server

```sh
pnpm run dev
```

### Build production

```sh
pnpm run build
```

### Start production server

```sh
pnpm start
```
