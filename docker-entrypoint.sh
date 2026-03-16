#!/bin/sh
set -e

# Run Prisma migrations on startup
# Use --schema to bypass prisma.config.ts (avoids needing its transitive deps in the runner)
# DATABASE_URL is provided via env_file in docker-compose
echo "Running database migrations..."
bunx prisma migrate deploy --schema /app/apps/web/prisma/schema.prisma

echo "Starting application..."
exec "$@"
