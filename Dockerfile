# Builder stage - compile and prepare dependencies
FROM node:22-slim AS builder
WORKDIR /usr/src/app

# Copy package files first for Docker layer caching
COPY package*.json ./

# Install all dependencies (prod + dev for build)
RUN npm ci --prefer-offline --no-audit

# Copy source files
COPY . .

# Precompile if needed
RUN npm run check 2>/dev/null || true

# Final runtime stage
FROM node:22-slim
WORKDIR /usr/src/app

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

# Copy package files for production install
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --prefer-offline --no-audit && npm cache clean --force

# Copy application files from builder
COPY --from=builder /usr/src/app . 

# Create non-root user for security
RUN useradd -m -u 1001 quartz && chown -R quartz:quartz /usr/src/app
USER quartz

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["npx", "quartz", "build", "--serve"]
