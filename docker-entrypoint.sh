#!/bin/sh
set -e

# Sync database schema on startup.
# Uses prisma db push instead of migrate deploy because the project's
# migrations are incomplete — many tables/columns only exist in schema.prisma.
# --skip-generate avoids regenerating the Prisma client at runtime.
echo "Syncing database schema..."
cd /app
NODE_PATH=/prisma-cli/node_modules /prisma-cli/node_modules/.bin/prisma db push --skip-generate --accept-data-loss

echo "Starting application..."
exec "$@"
