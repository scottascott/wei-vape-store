# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `pnpm build` now runs `prisma generate` itself (see package.json) — needed
# since src/generated/prisma is gitignored and wouldn't exist otherwise.
# The build only needs modules to import cleanly (all routes here are dynamic,
# server-rendered on demand) — real secrets are supplied at `docker run` time.
ENV SKIP_ENV_VALIDATION=1
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
# pnpm's node_modules is a tree of symlinks into node_modules/.pnpm, so `prisma
# migrate deploy` (run from docker-entrypoint.sh) needs the full tree, not just
# node_modules/prisma and node_modules/@prisma — those alone are dangling symlinks.
COPY --from=builder /app/node_modules ./node_modules
COPY docker-entrypoint.sh ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD ["node", "server.js"]
