# Docker Setup Guide

## Prerequisites
- Docker installed on your machine
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### Using Docker Compose (Recommended)

1. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Build and run the container**
   ```bash
   docker-compose up --build
   ```

3. **Run in detached mode (background)**
   ```bash
   docker-compose up -d
   ```

4. **View logs**
   ```bash
   docker-compose logs -f
   ```

5. **Stop the container**
   ```bash
   docker-compose down
   ```

### Using Docker directly

1. **Build the image**
   ```bash
   docker build -t portfolio .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -v $(pwd)/local.db:/app/local.db \
     -e NODE_ENV=production \
     --name portfolio-app \
     portfolio
   ```

3. **Stop the container**
   ```bash
   docker stop portfolio-app
   docker rm portfolio-app
   ```

## Environment Variables

Make sure to set the following environment variables in your `.env` file or in the `docker-compose.yml`:

- `DATABASE_URL` - SQLite database path
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `EMAIL_USER` - Email for NodeMailer
- `EMAIL_PASS` - Email password for NodeMailer
- `BETTER_AUTH_SECRET` - Secret key for Better Auth
- `BETTER_AUTH_URL` - Application URL

## Database Migration

To run database migrations in the Docker container:

```bash
# If using docker-compose
docker-compose exec portfolio npm run db:migrate

# If using docker run
docker exec -it portfolio-app npm run db:migrate
```

## Accessing the Application

Once the container is running, access your portfolio at:
- http://localhost:3000

## Production Deployment

For production deployment, consider:

1. Using a managed database instead of SQLite
2. Setting up proper environment variables
3. Using a reverse proxy (nginx) for SSL/TLS
4. Setting up proper logging and monitoring
5. Using Docker secrets for sensitive data

## Troubleshooting

### Port already in use
If port 3000 is already in use, change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 on host
```

### Database not persisting
Make sure the volume mapping in `docker-compose.yml` is correct and the local.db file has proper permissions.

### Build fails
Try cleaning Docker cache:
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```
