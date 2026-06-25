# ==========================================
# Stage 1: Build the React Frontend
# ==========================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copies from the uppercase 'Backend' folder on GitHub
COPY Backend/src/main/resources/static/frontend/package*.json ./
RUN npm install

# Copies from the uppercase 'Backend' folder on GitHub
COPY Backend/src/main/resources/static/frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build the Java Spring Boot Backend
# ==========================================
FROM maven:3.8.5-openjdk-17 AS backend-builder
WORKDIR /app/backend

# Copies from the uppercase 'Backend' folder on GitHub
COPY Backend/pom.xml ./
COPY Backend/src ./src

# Copies the compiled React assets from Stage 1 into the builder
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