package org.example.camunda.process.solution.facade.dto.casemgmt;

public class MessageConf {

  private String id;
  private boolean enabled;
  private String bpmnProcessId;
  private String elementId;
  private String message;
  private String name;
  private String formKey;
  private String correlationKey;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public String getBpmnProcessId() {
    return bpmnProcessId;
  }

  public void setBpmnProcessId(String bpmnProcessId) {
    this.bpmnProcessId = bpmnProcessId;
  }

  public String getElementId() {
    return elementId;
  }

  public void setElementId(String elementId) {
    this.elementId = elementId;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getFormKey() {
    return formKey;
  }

  public void setFormKey(String formKey) {
    this.formKey = formKey;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCorrelationKey() {
    return correlationKey;
  }

  public void setCorrelationKey(String correlationKey) {
    this.correlationKey = correlationKey;
  }
}
