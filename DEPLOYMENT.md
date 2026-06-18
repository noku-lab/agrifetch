# AgriFetch Deployment Guide

Single **Hetzner Cloud CAX11 (ARM)** VPS running the production stack via Docker
Compose, fronted by **Caddy** (automatic HTTPS) and fed by **GitHub Actions**
(free tier) building `linux/arm64` images into **GHCR**.

```
Internet ──▶ Caddy (80/443, TLS)
                ├─ /api/*, /ws/*  ──▶ backend  (FastAPI, gunicorn+uvicorn)
                └─ everything else ─▶ frontend (nginx + Vite SPA)
                                     backend ──▶ db (PostGIS 16)
                                     documents ──▶ Hetzner Object Storage
```

## 1. Prerequisites

- A Hetzner Cloud **CAX11** (Ubuntu 24.04 LTS, ARM64).
- DNS for `agrifetch.co.za`:
  - `A`    `agrifetch.co.za` → server IPv4
  - `AAAA` `agrifetch.co.za` → server IPv6 (optional)
- A Hetzner **Object Storage** bucket + access keys (documents + backups).

## 2. Provision the server

```bash
# As root on the fresh VPS
apt-get update && apt-get upgrade -y
apt-get install -y ca-certificates curl git ufw awscli

# Docker Engine + Compose plugin
curl -fsSL https://get.docker.com | sh

# Firewall
ufw allow OpenSSH
ufw allow 80,443/tcp
ufw --force enable

# Non-root deploy user
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
mkdir -p /opt/agrifetch && chown deploy:deploy /opt/agrifetch
```

Add your CI deploy public key to `/home/deploy/.ssh/authorized_keys`.

## 3. Place the stack files

As the `deploy` user:

```bash
cd /opt/agrifetch
git clone https://github.com/<owner>/agrifetch.git .
cp .env.example .env
nano .env          # set domain, DB password, JWT secret, S3 keys, image owner
```

The `.env` must set `FRONTEND_IMAGE` / `BACKEND_IMAGE` to your GHCR images
(`ghcr.io/<owner>/agrifetch-frontend:latest`, `...-backend:latest`).

### Authenticate to GHCR (private packages)

If the GHCR packages are private, log in once on the server with a PAT that has
`read:packages`:

```bash
echo "<GHCR_PAT>" | docker login ghcr.io -u <github-username> --password-stdin
```

(Or make the two packages public in GitHub → Packages, and skip this.)

## 4. GitHub repository secrets

Settings → Secrets and variables → Actions:

| Secret | Purpose |
| --- | --- |
| `SSH_HOST` | Server IP / hostname |
| `SSH_USER` | `deploy` |
| `SSH_KEY`  | Private key matching the deploy user's authorized_keys |

GHCR push uses the built-in `GITHUB_TOKEN` (no secret needed).

## 5. First deploy

`git push` to `main` triggers `.github/workflows/deploy.yml`:

1. Builds **linux/arm64** frontend + backend images via `buildx`.
2. Pushes them to GHCR (`:latest` and `:sha-<short>`).
3. SSHes to the server and runs `docker compose pull && up -d`.

Or deploy manually on the server:

```bash
cd /opt/agrifetch
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Migrations run automatically via the one-shot `migrate` service before the
backend starts. Caddy provisions the TLS certificate for `agrifetch.co.za`
on first request (DNS must already resolve to the server).

### Seed demo data (optional, once)

```bash
docker compose -f docker-compose.prod.yml run --rm backend python -m app.seed
```

## 6. Operations

- **Health:** `https://agrifetch.co.za/healthz` (compose also healthchecks the backend/db).
- **Logs:** `docker compose -f docker-compose.prod.yml logs -f backend`
- **Backups:** schedule the nightly DB dump → Object Storage:

```bash
chmod +x /opt/agrifetch/deploy/backup.sh
# crontab -e  (as deploy)
0 2 * * * /opt/agrifetch/deploy/backup.sh >> /var/log/agrifetch-backup.log 2>&1
```

Enable bucket versioning/lifecycle on the documents bucket in Hetzner.

## 7. Notes & caveats

- **Single backend worker:** the realtime ticker + WS manager run in-process
  (`GUNICORN_WORKERS=1`). To scale horizontally, add Redis pub/sub and raise the
  worker count.
- **ARM images:** CI always builds `linux/arm64` to match CAX11. Building locally
  on an x86 machine requires `docker buildx --platform linux/arm64`.
- **Compose/Caddyfile changes** are picked up by `git pull` on the server; image
  changes by the deploy workflow.
