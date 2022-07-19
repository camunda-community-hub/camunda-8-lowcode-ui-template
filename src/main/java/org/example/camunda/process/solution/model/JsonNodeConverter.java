package org.example.camunda.process.solution.model;

import java.io.IOException;

import javax.persistence.AttributeConverter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonNodeConverter implements AttributeConverter<JsonNode, String> {

    private final Logger logger = LoggerFactory.getLogger(JsonNodeConverter.class);

    private static ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public String convertToDatabaseColumn(JsonNode attribute) {

        String json = null;
        try {
            json = objectMapper.writeValueAsString(attribute);
        } catch (final JsonProcessingException e) {
            logger.error("JSON writing error", e);
        }

        return json;
    }

    @Override
    public JsonNode convertToEntityAttribute(String json) {
        if (json==null) {
            return null;
        }
        JsonNode attribute = null;
        try {
            attribute = objectMapper.readValue(json, JsonNode.class);
        } catch (final IOException e) {
            logger.error("JSON reading error", e);
        }

        return attribute;
    }

}
