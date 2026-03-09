# Build với Maven và OpenJDK 17
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml trước để cache dependencies
COPY pom.xml .

# Download dependencies (sẽ được cache nếu pom.xml không đổi)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build ứng dụng
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy jar file từ builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
