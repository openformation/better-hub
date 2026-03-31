import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

type ExtendedPrismaClient = ReturnType<typeof makePrisma>;

const _proc = process as typeof process & {
	__dbPool?: Pool;
	__prisma?: ExtendedPrismaClient;
};

function getOrCreatePool(): Pool {
	if (_proc.__dbPool) return _proc.__dbPool;

	const isDev = process.env.NODE_ENV !== "production";
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		// With PgBouncer handling connection pooling, we need fewer connections
		// from the application side. Each Next.js instance can maintain a small pool.
		max: isDev ? 10 : 3,
		idleTimeoutMillis: isDev ? 10_000 : 60_000,
		connectionTimeoutMillis: isDev ? 0 : 5_000,
		allowExitOnIdle: true,
	});

	_proc.__dbPool = pool;
	attachDatabasePool(pool);
	return pool;
}

function makePrisma() {
	const pool = getOrCreatePool();
	const adapter = new PrismaPg(pool);
	return new PrismaClient({ adapter });
}

export const prisma: ExtendedPrismaClient = _proc.__prisma ?? (_proc.__prisma = makePrisma());
