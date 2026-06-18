# AgriFetch frontend image (linux/amd64 — matches the deployment server).
# Stage 1 builds the Vite SPA; stage 2 is a minimal Node 22 runtime that
# serves static files and handles POST /api/enquiry — no nginx, no extra deps.
#
# The build stage is pinned to the BUILD machine's native platform so the
# heavy npm build never runs under cross-arch emulation. Vite output is plain
# static JS/CSS/HTML (architecture-independent), so this is safe regardless of
# the eventual target platform.
FROM --platform=$BUILDPLATFORM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

COPY server.mjs .
COPY --from=build /app/dist ./dist

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz >/dev/null 2>&1 || exit 1

CMD ["node", "server.mjs"]
