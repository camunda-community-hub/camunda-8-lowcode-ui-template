package org.example.camunda.process.solution.facade.dto;

import java.util.Set;

public class WorkerDefinition {

  private String type;
  private String name;
  private Set<String> fetchVariables;

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<String> getFetchVariables() {
    return fetchVariables;
  }

  public void setFetchVariables(Set<String> fetchVariables) {
    this.fetchVariables = fetchVariables;
  }
}
