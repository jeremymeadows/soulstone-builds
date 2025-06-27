FROM oven/bun:alpine

WORKDIR /app

COPY build/ ./

RUN bun add clsx
RUN bun install --production

EXPOSE 3000

CMD ["bun", "index.js"]
