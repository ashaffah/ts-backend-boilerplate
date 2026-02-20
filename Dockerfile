FROM oven/bun:latest AS builder

WORKDIR /app

# Cleanup cache apt
RUN apt-get update && apt-get install -y rsync && rm -rf /var/lib/apt/lists/*

COPY package.json *.lock* ./
COPY src ./src
COPY prisma.config.ts .
COPY prisma ./prisma
COPY tsconfig.json .
COPY detect-os.ts .

RUN bun install --frozen-lockfile --registry=https://registry.npmjs.org

RUN bun run generate
RUN bun run build:unix
RUN bun pm cache && rm -rf ~/.bun
# CMD [ "tail", "-f", "/dev/null" ]

# === Deploy stage ===
FROM oven/bun:latest AS deploy

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./dist/node_modules
COPY --from=builder /app/package.json ./dist/package.json
COPY --from=builder /app/tsconfig.json ./dist/tsconfig.json

# CMD [ "tail", "-f", "/dev/null" ]
CMD ["bun", "dist/src/main.js"]