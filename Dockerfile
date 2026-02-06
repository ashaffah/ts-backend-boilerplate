FROM oven/bun:latest AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y rsync

COPY package.json .
COPY *.lock .
COPY /src ./src
COPY tsconfig.json .
COPY detect-os.ts .
COPY /prisma ./prisma
COPY /generated ./generated

RUN bun install

RUN bun run generate
RUN bun run build



FROM oven/bun:latest AS deploy

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./dist/node_modules
COPY --from=builder /app/package.json ./dist/package.json
COPY --from=builder /app/tsconfig.json ./dist/tsconfig.json

# CMD [ "tail", "-f", "/dev/null" ]
CMD [ "bun", "run", "./dist/src/main.js" ]