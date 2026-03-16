#!/bin/sh
set -e

# Run Prisma migrations on startup
# Uses /app/prisma.config.ts (Docker-specific, no dotenv dependency)
echo "Running database migrations..."
cd /app
bunx prisma migrate deploy

echo "Starting application..."
exec "$@"
