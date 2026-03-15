#!/bin/sh
set -e

# Run Prisma migrations on startup
echo "Running database migrations..."
cd /app/apps/web
bunx prisma migrate deploy
cd /app

echo "Starting application..."
exec "$@"
