# Stage 1: Base Node.js image (minimal alpine version)
FROM node:20-alpine AS base
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
# Use npm install instead of npm ci for resilience against mismatched lock files
RUN npm install --legacy-peer-deps

# Development stage
FROM deps AS development
COPY . .
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED 1
# Explicitly install CSS processing dependencies with peer dependency override
RUN npm install --save-dev --legacy-peer-deps tailwindcss@latest postcss@latest autoprefixer@latest
CMD ["npm", "run", "dev"]

# Stage 3: Build the application
FROM deps AS builder
COPY . .
# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 4: Production image
FROM base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next && \
    chown nextjs:nodejs .next

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "server.js"]