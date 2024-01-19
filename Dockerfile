FROM eclipse-temurin:17-jdk-alpine
RUN addgroup -S camunda && \
	adduser -S camunda -G camunda
USER camunda

EXPOSE 8080
WORKDIR /app

COPY --chown=camunda workspace /app/workspace/

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} /app/runtime.jar
ENTRYPOINT ["java","-jar","/app/runtime.jar"]