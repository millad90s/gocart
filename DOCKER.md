# Docker Setup Guide

This guide explains how to run the GoCart application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed

## Services

The docker-compose.yml file defines three services:

1. **PostgreSQL Database** (`gocart-postgres`)
   - Port: 5432
   - Database: gocart
   - Username: gocart
   - Password: gocart_password

2. **MinIO Object Storage** (`gocart-minio`)
   - API Port: 9000
   - Console Port: 9001
   - Access Key: minioadmin
   - Secret Key: minioadmin123

3. **Next.js Application** (`gocart-app`)
   - Port: 3000

## Quick Start

### 1. Build and Start All Services

```bash
docker-compose up -d --build
```

This will:
- Build the Next.js application Docker image
- Start PostgreSQL, MinIO, and the application
- Wait for database and MinIO to be healthy before starting the app

### 2. View Logs

View all logs:
```bash
docker-compose logs -f
```

View specific service logs:
```bash
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f minio
```

### 3. Stop All Services

```bash
docker-compose down
```

To also remove volumes (database data):
```bash
docker-compose down -v
```

## Database Migrations

The application uses Prisma for database management. To run migrations:

### Option 1: Using local Prisma CLI (recommended)

```bash
# Make sure your .env file has the correct DATABASE_URL
DATABASE_URL="postgresql://gocart:gocart_password@localhost:5432/gocart"

# Run migrations
npm run db:push

# Or run migrations for production
npm run db:migrate
```

### Option 2: Inside the Docker container

```bash
docker-compose exec app sh
# Inside the container, you'll need to install prisma first
npm install prisma
npx prisma db push
```

## Environment Variables

The docker-compose.yml file sets these environment variables for the app:

- `NODE_ENV=production`
- `DATABASE_URL=postgresql://gocart:gocart_password@postgres:5432/gocart`
- `MINIO_ENDPOINT=minio`
- `MINIO_PORT=9000`
- `MINIO_ACCESS_KEY=minioadmin`
- `MINIO_SECRET_KEY=minioadmin123`

## Accessing Services

- **Application**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **MinIO API**: http://localhost:9000
- **MinIO Console**: http://localhost:9001
  - Login with: minioadmin / minioadmin123

## Development Workflow

### Making Changes to the Code

1. Make your code changes
2. Rebuild and restart the app:
   ```bash
   docker-compose up -d --build app
   ```

### Quick Restart (without rebuild)

```bash
docker-compose restart app
```

## Troubleshooting

### Check Container Status

```bash
docker-compose ps
```

### View Container Logs

```bash
docker-compose logs --tail=50 app
```

### Restart a Service

```bash
docker-compose restart app
```

### Clean Start

Remove everything and start fresh:

```bash
docker-compose down -v
docker-compose up -d --build
```

### Database Connection Issues

If the app can't connect to PostgreSQL:

1. Check if postgres is healthy:
   ```bash
   docker-compose ps postgres
   ```

2. Check postgres logs:
   ```bash
   docker-compose logs postgres
   ```

3. Verify the connection manually:
   ```bash
   docker-compose exec postgres psql -U gocart -d gocart
   ```

## Production Deployment

For production deployment:

1. Update environment variables in docker-compose.yml:
   - Change database credentials
   - Set strong MinIO credentials
   - Add other required environment variables (NextAuth secret, API keys, etc.)

2. Use environment file:
   Create a `.env.production` file and update docker-compose.yml to use it:
   ```yaml
   app:
     env_file:
       - .env.production
   ```

3. Use Docker secrets or external secret management for sensitive data

4. Consider using a managed database service instead of the containerized PostgreSQL

5. Set up proper backup strategies for PostgreSQL and MinIO volumes

## Volume Management

Data is persisted in Docker volumes:

- `postgres_data`: PostgreSQL database files
- `minio_data`: MinIO object storage files

To backup volumes:
```bash
docker run --rm -v gocart_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .
docker run --rm -v gocart_minio_data:/data -v $(pwd):/backup alpine tar czf /backup/minio-backup.tar.gz -C /data .
```
