# ==========================================
# Stage 1: Build the React Frontend
# ==========================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend dependency files directly from the root-level src path
COPY src/main/resources/static/frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY src/main/resources/static/frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build the Java Spring Boot Backend
# ==========================================
FROM maven:3.8.5-openjdk-17 AS backend-builder
WORKDIR /app/backend

# Copy backend pom.xml and src directly from the repository root
COPY pom.xml ./
COPY src ./src

# Copy the compiled production-ready React assets into the target static folder
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Build the final Java executable (.jar)
RUN mvn clean package -DskipTests

# ==========================================
# Stage 3: Production Run
# ==========================================
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the finished .jar file from Stage 2
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Document the container port
EXPOSE 8080

# Start the unified application
CMD ["java", "-jar", "app.jar"]