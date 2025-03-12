FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
# COPY .npmrc .npmrc

# Install dependencies
RUN bun install

# Copy the backend code again
COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile server \
  ./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

CMD ["./server"]

EXPOSE 4000