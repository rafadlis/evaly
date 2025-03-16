FROM oven/bun:debian AS build

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libvips-dev \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables to ensure x64 architecture build
ENV npm_config_arch=x64
ENV npm_config_platform=linux
ENV npm_config_target_platform=linux

# Copy package.json files only (without lock files)
COPY package.json package.json
# COPY .npmrc .npmrc

COPY /backend/package.json ./backend/package.json
COPY /frontend/package.json ./frontend/package.json

# Copy the backend code
COPY /backend ./backend

# Force fresh install with all dependencies
RUN bun install --no-cache

ENV NODE_ENV=production

# Build the application
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
# Copy the node_modules with sharp
COPY --from=build /app/node_modules/sharp /app/node_modules/sharp

CMD ["./server"]

EXPOSE 4000