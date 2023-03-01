package org.example.camunda.process.solution.utils;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.UUID;
import org.example.camunda.process.solution.exception.TechnicalException;
import org.example.camunda.process.solution.facade.dto.WorkerDefinition;

public class ConnectorTemplateUtils {
  private ConnectorTemplateUtils() {}

  public static JsonNode generateElementTemplate(WorkerDefinition worker) {
    try {
      return JsonUtils.toJsonNode(generateElementTemplateAsString(worker));
    } catch (IOException e) {
      throw new TechnicalException("Error generating an element template", e);
    }
  }

  public static String generateElementTemplateAsString(WorkerDefinition worker) {
    StringBuilder sb =
        new StringBuilder(
                "{\"$schema\": \"https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json\",")
            .append("\"id\": \"")
            .append(UUID.randomUUID().toString())
            .append("\",")
            .append("\"name\": \"")
            .append(worker.getName())
            .append("\",")
            .append("\"appliesTo\": [\"bpmn:Task\"],")
            .append("\"elementType\": {\"value\": \"bpmn:ServiceTask\"},")
            .append("\"properties\": [")
            .append("{\"type\": \"Hidden\",\"value\": \"")
            .append(worker.getType())
            .append("\",\"binding\": {\"type\": \"zeebe:taskDefinition:type\"}}");
    for (String variable : worker.getFetchVariables()) {
      sb.append(",{\"label\": \"")
          .append(variable)
          .append("\",\"description\": \"")
          .append(variable)
          .append("\",\"value\": \"=")
          .append(variable)
          .append("\",\"type\": \"String\",\"feel\": \"optional\",")
          .append("\"binding\": {\"type\": \"zeebe:input\",\"name\": \"")
          .append(variable)
          .append("\"},\"constraints\": {\"notEmpty\": true}}");
    }
    sb.append("]}");
    return sb.toString();
  }
}
