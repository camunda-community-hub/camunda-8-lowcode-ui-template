package org.example.camunda.process.solution.jsonmodel;

import java.util.Date;
import java.util.Map;

public class Theme {

  private String name;

  private Date modified;

  private Map<String, String> variables;

  private String content;

  private boolean active;

  public Theme() {}

  public Theme(String name, String content) {
    super();
    this.name = name;
    this.content = content;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public Date getModified() {
    return modified;
  }

  public void setModified(Date modified) {
    this.modified = modified;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public Map<String, String> getVariables() {
    return variables;
  }

  public void setVariables(Map<String, String> variables) {
    this.variables = variables;
  }
}
