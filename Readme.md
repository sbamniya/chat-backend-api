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

### Migrate Prisma

```sh
pnpm run prisma:migrate:dev
```

### Generate Prisma Schema

```sh
pnpm run prisma:generate
```

## Other prisma commands

if you want to run any other command then the two mentioned with prisma, you don't need prisma installed globally. You can do it following way.

```sh
pnpm run prisma -- generate
```

```sh
pnpm run prisma -- migrate
```

```sh
pnpm run prisma -- migrate
```

```sh
pnpm run prisma -- deploy
```

### Build production

```sh
pnpm run build
```

### Start production server

```sh
pnpm start
```
