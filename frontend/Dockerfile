# AgriFetch frontend image.
# Stage 1 builds the Vite SPA; stage 2 is a minimal Node 22 runtime that
# serves static files and handles POST /api/enquiry — no nginx, no extra deps.
#
# The build stage is pinned to the BUILD machine's native platform (amd64 on
# the GitHub runner). The Vite output is plain static JS/CSS/HTML, which is
# architecture-independent — so we avoid running npm under slow ARM emulation.
# Only the lightweight runtime stage targets arm64 (it just copies files).
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
