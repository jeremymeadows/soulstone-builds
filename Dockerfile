FROM oven/bun:alpine

WORKDIR /app

COPY package.json build/ ./

RUN bun add clsx
RUN bun install --dry-run
RUN bun install --production

EXPOSE 3000

CMD ["bun", "index.js"]
