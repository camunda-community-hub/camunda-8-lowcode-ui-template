package org.example.camunda.process.solution.model;

import com.fasterxml.jackson.databind.JsonNode;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Lob;

@Entity
public class Form extends BaseEntity {

  private String name;

  @Lob
  @Convert(converter = JsonNodeConverter.class)
  private JsonNode schema;

  @Lob
  @Convert(converter = JsonNodeConverter.class)
  private JsonNode previewData;

  public Form() {}

  public Form(String name, JsonNode schema) {
    super();
    this.name = name;
    this.schema = schema;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public JsonNode getSchema() {
    return schema;
  }

  public void setSchema(JsonNode schema) {
    this.schema = schema;
  }

  public JsonNode getPreviewData() {
    return previewData;
  }

  public void setPreviewData(JsonNode previewData) {
    this.previewData = previewData;
  }
}
