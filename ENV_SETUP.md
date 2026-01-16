# Environment Configuration

This project uses separate environment files for development and production.

## Environment Files

- **`.env.development`** - Development environment (Docker PostgreSQL)
- **`.env.production`** - Production environment (Production PostgreSQL)
- **`.env`** - Default environment file (automatically uses .env.development in dev mode)

## Setup

### Development Environment

1. Start Docker PostgreSQL:
```bash
npm run docker:up
```

2. The app automatically uses `.env.development` when running:
```bash
npm run dev
```

3. Run database migrations:
```bash
npm run db:push
```

### Production Environment

1. Update `.env.production` with your production database credentials:
```env
DATABASE_URL="postgresql://user:password@your-host:5432/gocart?schema=public&sslmode=require"
DIRECT_URL="postgresql://user:password@your-host:5432/gocart?schema=public&sslmode=require"
```

2. Build for production:
```bash
npm run build:prod
```

3. Run production migrations:
```bash
npm run db:push:prod
# or
npm run db:migrate:prod
```

## Available Scripts

### Development
- `npm run dev` - Start dev server (uses .env.development)
- `npm run db:push` - Push schema to dev database
- `npm run db:migrate` - Run migrations on dev database
- `npm run db:studio` - Open Prisma Studio for dev database

### Production
- `npm run build:prod` - Build for production
- `npm run db:push:prod` - Push schema to production database
- `npm run db:migrate:prod` - Deploy migrations to production
- `npm run db:studio:prod` - Open Prisma Studio for production database

### Docker
- `npm run docker:up` - Start PostgreSQL container
- `npm run docker:down` - Stop PostgreSQL container
- `npm run docker:logs` - View PostgreSQL logs
