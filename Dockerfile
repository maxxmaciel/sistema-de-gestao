# Mesmo caminho do build.cmd, em Linux: front buildado dentro do backend + jar executável único.

# [1/3] Front: typecheck + vite build (sai em backend/src/main/resources/public)
FROM node:22-slim AS front
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# [2/3] Back: mvn package (gera target/framework-generico.jar com o front dentro)
FROM maven:3.9-eclipse-temurin-17 AS back
WORKDIR /app/backend
COPY backend/pom.xml ./
COPY backend/src ./src
COPY --from=front /app/backend/src/main/resources/public ./src/main/resources/public
RUN mvn -q -B package

# [3/3] Só o JRE e o jar. A porta vem da variável PORT (o Render define; o padrão é 8080).
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=back /app/backend/target/framework-generico.jar app.jar
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
