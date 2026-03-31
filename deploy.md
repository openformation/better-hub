# Self-Hosted Deployment

Run Better Hub locally with Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (v2+)
- A [GitHub OAuth App](https://github.com/settings/developers)

## 1. Create a GitHub OAuth App

1. Go to **Settings → Developer settings → OAuth Apps → New OAuth App**
2. Set the fields:
   - **Application name**: anything (e.g. "Better Hub Local")
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. After creating, copy the **Client ID** and generate a **Client Secret**

## 2. Configure environment

```sh
cp apps/web/.env.docker apps/web/.env
```

Edit `apps/web/.env` and fill in:

| Variable | Value |
|---|---|
| `GITHUB_CLIENT_ID` | Your OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Your OAuth App Client Secret |
| `BETTER_AUTH_SECRET` | A random string (`openssl rand -hex 16`) |

The database and Redis URLs are pre-configured for Docker networking — no changes needed.

## 3. Start the stack

```sh
docker compose up --build
```

This starts:

- **postgres** — PostgreSQL 16 database
- **redis** + **redis-rest** — Redis with HTTP REST API (Upstash-compatible)
- **app** — Better Hub Next.js application

On first boot, `prisma db push` syncs the database schema before the app starts.

## 4. Open the app

Visit [http://localhost:3000](http://localhost:3000) and sign in with GitHub.

## Architecture

The Docker setup uses `docker-compose.override.yml` to add the `app` service on top of the base `docker-compose.yml`. This keeps the base file identical to upstream so you can sync without merge conflicts.

```
docker-compose.yml            ← upstream (postgres, redis, redis-rest)
docker-compose.override.yml   ← self-hosted additions (app service, healthchecks)
Dockerfile                    ← multi-stage build (deps → build → slim runner)
docker-entrypoint.sh          ← runs prisma db push on boot
apps/web/.env.docker           ← env template for Docker networking
```

## Rebuilding

After pulling new changes:

```sh
docker compose up --build
```

The database schema is synced automatically on each boot via `prisma db push`, so schema changes are applied without extra steps.

## Stopping

```sh
docker compose down
```

To also remove the database volume:

```sh
docker compose down -v
```
