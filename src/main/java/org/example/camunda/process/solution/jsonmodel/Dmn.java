package org.example.camunda.process.solution.jsonmodel;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.Date;

public class Dmn {

  private String name;

  private Date modified;

  private String definition;

  private String decisionId;

  private JsonNode contextData;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Date getModified() {
    return modified;
  }

  public void setModified(Date modified) {
    this.modified = modified;
  }

  public String getDefinition() {
    return definition;
  }

  public void setDefinition(String definition) {
    this.definition = definition;
  }

  public String getDecisionId() {
    return decisionId;
  }

  public void setDecisionId(String decisionId) {
    this.decisionId = decisionId;
  }

  public JsonNode getContextData() {
    return contextData;
  }

  public void setContextData(JsonNode contextData) {
    this.contextData = contextData;
  }
}
