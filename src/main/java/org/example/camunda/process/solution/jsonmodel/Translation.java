package org.example.camunda.process.solution.jsonmodel;

import java.util.Date;
import java.util.Map;

public class Translation {

  private String name;

  private String code;

  private Date modified;

  private Map<String, String> translations;

  public Translation() {}

  public Translation(String name, String code) {
    super();
    this.name = name;
    this.code = code;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public Date getModified() {
    return modified;
  }

  public void setModified(Date modified) {
    this.modified = modified;
  }

  public Map<String, String> getTranslations() {
    return translations;
  }

  public void setTranslations(Map<String, String> translations) {
    this.translations = translations;
  }
}
