FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock
# COPY .npmrc .npmrc

COPY /backend/package.json ./backend/package.json
COPY /frontend/package.json ./frontend/package.json

# Copy the backend code because we need to generate the types first
COPY /backend ./backend

RUN bun install --frozen-lockfile

# Copy the backend code again
COPY /backend ./backend

ENV NODE_ENV=production

# Run the build:tsup script to generate the dist folder
RUN cd backend

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