#!/bin/sh
set -e

# Run Prisma migrations on startup
# Uses /app/prisma.config.ts (Docker-specific, no dotenv dependency)
# Prisma CLI installed at /prisma-cli to avoid conflicts with standalone output
echo "Running database migrations..."
cd /app
/prisma-cli/node_modules/.bin/prisma migrate deploy

echo "Starting application..."
exec "$@"
