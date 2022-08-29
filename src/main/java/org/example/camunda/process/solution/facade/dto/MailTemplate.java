package org.example.camunda.process.solution.facade.dto;

import java.util.Date;

public class MailTemplate {

  private String name;

  private Date modified;

  private String htmlTemplate;

  public MailTemplate() {}

  public MailTemplate(String name, String htmlTemplate) {
    super();
    this.name = name;
    this.htmlTemplate = htmlTemplate;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getHtmlTemplate() {
    return htmlTemplate;
  }

  public void setHtmlTemplate(String htmlTemplate) {
    this.htmlTemplate = htmlTemplate;
  }

  public Date getModified() {
    return modified;
  }

  public void setModified(Date modified) {
    this.modified = modified;
  }
}
