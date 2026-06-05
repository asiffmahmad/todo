# ---------- Build Stage: Frontend ----------
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/. ./
RUN npm run build

# ---------- Build Stage: Backend (with static assets) ----------
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /backend
# Copy backend source
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY backend/src ./src
# Copy built frontend assets into Spring Boot static resources
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build /frontend/dist/ ./src/main/resources/static/
# Package the application (skip tests for speed)
RUN mvn package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app
# Add a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Copy the fat jar from backend build stage
COPY --from=backend-build /backend/target/todo-backend-1.0.0.jar app.jar
# Create directory for H2 database persistence
RUN mkdir -p data && chown -R appuser:appgroup /app
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s CMD curl -f http://localhost:8080/actuator/health || curl -f http://localhost:8080 || exit 1
ENTRYPOINT ["java","-jar","app.jar"]
