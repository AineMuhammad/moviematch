import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Next.js loads .env.local itself; the Prisma CLI does not, so load it here too.
loadEnv({ path: '.env' });
loadEnv({ path: '.env.local', override: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // The CLI (migrate/studio/db pull) needs the direct, non-pooled connection — Neon's
    // pooler runs in PgBouncer transaction mode, which breaks migrations. The app's
    // runtime PrismaClient (src/lib/prisma.ts) uses the pooled DATABASE_URL separately.
    url: env('DATABASE_URL_UNPOOLED'),
  },
});
