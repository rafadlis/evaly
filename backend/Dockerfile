FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock
# COPY .npmrc .npmrc

COPY /backend/package.json ./backend/package.json
COPY /frontend/package.json ./frontend/package.json

RUN bun install

COPY /backend ./backend

# Generate the types in backend
WORKDIR /app/backend
RUN bun tsup src/index.ts src/types/*.ts --dts

ENV NODE_ENV=production

# Run the build:tsup script to generate the dist folder
WORKDIR /app/backend

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