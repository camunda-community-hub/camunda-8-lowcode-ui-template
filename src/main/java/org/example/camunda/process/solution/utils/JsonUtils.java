package org.example.camunda.process.solution.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import org.example.camunda.process.solution.exception.TechnicalException;

public class JsonUtils {

  private JsonUtils() {}

  private static ObjectMapper mapper;

  public static JsonNode toJsonNode(InputStream is) throws IOException {
    return getObjectMapper().readTree(is);
  }

  public static JsonNode toJsonNode(String json) throws IOException {
    return getObjectMapper().readTree(json);
  }

  public static <T> T toObject(String json, Class<T> type) {
    try {
      return getObjectMapper().readValue(json, type);
    } catch (JsonProcessingException e) {
      throw new TechnicalException(e);
    }
  }

  public static <T> T toParametrizedObject(String json, TypeReference<T> type) {
    try {
      return getObjectMapper().readValue(json, type);
    } catch (JsonProcessingException e) {
      throw new TechnicalException(e);
    }
  }

  public static String toJson(Object object) throws IOException {
    return getObjectMapper().writeValueAsString(object);
  }

  public static void toJsonFile(Path path, Object object) throws IOException {
    getObjectMapper().writeValue(path.toFile(), object);
  }

  public static <T> T fromJsonFile(Path path, Class<T> type)
      throws StreamReadException, DatabindException, IOException {
    return getObjectMapper().readValue(path.toFile(), type);
  }

  private static ObjectMapper getObjectMapper() {
    if (mapper == null) {
      mapper = new ObjectMapper();
      mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }
    return mapper;
  }
}
