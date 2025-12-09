
# NDIS Insight - Deployment Guide

## 1. Environment Configuration
Create a `.env` file in the root directory based on the schema below.

```bash
# .env.example

# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ndis-insight.com

# Database (Supabase / Postgres)
DATABASE_URL=postgres://user:password@hostname:5432/ndis_db
DIRECT_URL=postgres://user:password@hostname:5432/ndis_db

# Vector Database (Pinecone / pgvector)
VECTOR_DB_TYPE=pgvector

# Security
ENCRYPTION_KEY=your_32_char_secret_key_for_api_keys
NEXTAUTH_SECRET=your_auth_secret

# Optional: Default Official Keys (If you offer a managed tier)
GEMINI_API_KEY=server_side_key_only
```

## 2. Docker Deployment
The application is containerized for easy deployment to cloud services (AWS ECS, Google Cloud Run, etc.).

```dockerfile
# Dockerfile

# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

## 3. Database Migration
Run the SQL initialization script found in `/migrations/init.sql` to set up:
- `users` table
- `model_configs` table (with encrypted API key column)
- `ndis_docs` and `ndis_doc_chunks` (with vector embedding column)

## 4. Weekly Updater Setup
The Weekly Updater (`services/documentUpdater.ts`) performs heavy scraping. In production, do not run this inside the Next.js API route.
1. Deploy the updater as a separate Worker (e.g., AWS Lambda or a separate Docker container).
2. Schedule it using a Cron trigger (e.g., EventBridge Schedule) to run every Sunday at 02:00 AM.
