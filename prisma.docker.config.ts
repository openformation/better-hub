// Minimal Prisma config for Docker runtime (prisma migrate deploy).
// Unlike apps/web/prisma.config.ts, this does not import dotenv
// since env vars are already provided by docker-compose env_file.
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "apps/web/prisma/schema.prisma",
	migrations: {
		path: "apps/web/prisma/migrations",
	},
	datasource: {
		url: process.env.DATABASE_URL!,
	},
});
