FROM --platform=linux/amd64 openjdk:21
LABEL authors="ropold"
EXPOSE 8080
COPY backend/target/immocalchub.jar immocalchub.jar
ENTRYPOINT ["java", "-jar", "immocalchub.jar"]