#!/usr/bin/env bash
# Nightly PostgreSQL backup -> Hetzner Object Storage (S3-compatible).
#
# Usage (typically via cron):
#   /opt/agrifetch/deploy/backup.sh
#
# Reads configuration from /opt/agrifetch/.env. Requires the AWS CLI on the
# host and the `db` service running under docker compose.
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/agrifetch}"
cd "$APP_DIR"

# shellcheck disable=SC1091
set -a; source .env; set +a

DB_CONTAINER="$(docker compose -f docker-compose.prod.yml ps -q db)"
if [ -z "$DB_CONTAINER" ]; then
  echo "db container not running" >&2
  exit 1
fi

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DUMP="/tmp/agrifetch_${STAMP}.sql.gz"

echo "Creating dump ${DUMP}..."
docker exec "$DB_CONTAINER" pg_dump -U "${POSTGRES_USER:-agrifetch}" "${POSTGRES_DB:-agrifetch}" \
  | gzip > "$DUMP"

BACKUP_BUCKET="${BACKUP_BUCKET:-${S3_BUCKET:-agrifetch-documents}}"
echo "Uploading to s3://${BACKUP_BUCKET}/backups/ ..."
AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$S3_SECRET_KEY" \
aws --endpoint-url "$S3_ENDPOINT_URL" --region "${S3_REGION:-fsn1}" \
  s3 cp "$DUMP" "s3://${BACKUP_BUCKET}/backups/agrifetch_${STAMP}.sql.gz"

rm -f "$DUMP"
echo "Backup complete."
