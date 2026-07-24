# Multi-stage Dockerfile cho ứng dụng Hồ Sơ Ứng Tuyển Con Rể

# Stage 1: Build React Frontend với Vite
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Stage 2: Express Backend Server & Serves Frontend Assets
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Mount volume cho uploads và saved_profiles.json
VOLUME ["/app/backend/uploads"]

EXPOSE 5000

WORKDIR /app/backend
CMD ["node", "server.js"]
