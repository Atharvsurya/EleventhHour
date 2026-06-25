# ==========================================
# Stage 1: Build the React Frontend
# ==========================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend dependency files
COPY backend/src/main/resources/static/frontend/package*.json ./
RUN npm install

# Copy frontend source code and build it (Vite outputs to the 'dist' folder)
COPY backend/src/main/resources/static/frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build the Java Spring Boot Backend
# ==========================================
FROM maven:3.8.5-openjdk-17 AS backend-builder
WORKDIR /app/backend

# Copy backend pom.xml and source code
COPY backend/pom.xml ./
COPY backend/src ./src

# THE MAGIC TRICK: Copy the compiled React files from Stage 1
# directly into the Spring Boot static resources folder before compiling Java
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Build the final Java .jar file
RUN mvn clean package -DskipTests

# ==========================================
# Stage 3: Production Run
# ==========================================
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the finished .jar file from the backend-builder stage
# (Maven usually outputs the jar to the 'target' folder)
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Document the port your Spring Boot app is listening on
EXPOSE 8080

# Start the application!
CMD ["java", "-jar", "app.jar"]