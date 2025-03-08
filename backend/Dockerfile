FROM oven/bun AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN bun install

COPY /backend ./backend

ENV NODE_ENV=production

# Run the build:tsup script to generate the dist folder
RUN cd backend && bun run prepare

RUN bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile server \
  ./backend/src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

CMD ["./server"]

EXPOSE 4000