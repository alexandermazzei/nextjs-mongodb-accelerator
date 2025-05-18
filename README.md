# Next.js MongoDB Accelerator

A high-performance, production-ready Next.js application with MongoDB, optimized for Docker environments.

## Features

- **Multi-stage Docker builds** - Optimized for both development and production
- **MongoDB integration** - With connection pooling and retry mechanism
- **TailwindCSS** - For efficient styling
- **Performance optimization** - Optimized Docker configuration and Next.js settings
- **Security headers** - Pre-configured security headers for production

## Requirements

- Docker and Docker Compose
- Node.js 18+ (for local development only)

## Quick Start

### Using Docker

The project includes development and production Docker configurations:

```bash
# Make the helper script executable
chmod +x docker.sh

# Start development environment
./docker.sh dev

# Start production environment
./docker.sh prod

# Stop all containers
./docker.sh down
```

### Manual Setup

1. Install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Start production server:

```bash
npm start
```

## Environment Variables

Configure these environment variables in your `.env` file or Docker environment:

```bash
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27018/nextjs_mongodb_dev

# Next Auth (if using authentication)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Node environment
NODE_ENV=development
```

## Docker Structure

The Docker setup consists of:

- **Multi-stage Dockerfile** with optimized layers for development and production
- **Docker Compose** configuration with profiles for dev and prod
- **MongoDB** container with volume persistence
- **Helper script** for common Docker operations

## Performance Optimizations

- Connection pooling for MongoDB
- Exponential backoff retry mechanism for database connections
- Optimized Docker layer caching
- Next.js standalone output mode for production
- TailwindCSS for optimized CSS delivery

## Directory Structure

```
├── Dockerfile            # Multi-stage Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── docker.sh             # Helper script for Docker operations
├── next.config.js        # Next.js configuration
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.js    # TailwindCSS configuration
└── src/
    ├── app/              # Next.js app directory
    │   └── globals.css   # Global styles with TailwindCSS
    └── lib/
        └── dbConnect.ts  # MongoDB connection utility
```

## Development Notes

- MongoDB runs on port 27018 to avoid conflicts with local instances
- The development environment includes hot-reloading
- TailwindCSS dependencies are installed during container startup

## Security

- Non-root user for production container
- Security headers pre-configured in Next.js
- Proper environment variable handling

## License

MIT