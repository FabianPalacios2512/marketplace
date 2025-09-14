# ---------- ETAPA 1: Construcción ----------
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Copiar pom.xml y bajar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar todo el código y compilar
COPY src ./src
RUN mvn clean package -DskipTests

# ---------- ETAPA 2: Ejecución ----------
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# Copiar el jar generado desde la etapa 1
COPY --from=builder /app/target/*.jar app.jar

# Puerto en el que corre Spring Boot
EXPOSE 8080

# Comando de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]
