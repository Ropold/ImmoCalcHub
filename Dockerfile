#FROM --platform=linux/amd64 openjdk:21
FROM eclipse-temurin:21-jdk
LABEL authors="ropold"
EXPOSE 8080
COPY backend/target/immocalchub.jar immocalchub.jar
ENTRYPOINT ["java", "-jar", "immocalchub.jar"]