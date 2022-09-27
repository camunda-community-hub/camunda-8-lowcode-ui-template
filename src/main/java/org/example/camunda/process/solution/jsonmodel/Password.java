package org.example.camunda.process.solution.jsonmodel;

public class Password {
  private String value;
  private boolean encrypted;

  public Password() {}

  public Password(String value) {
    this.value = value;
    this.encrypted = false;
  }

  public String getValue() {
    return this.value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public boolean isEncrypted() {
    return encrypted;
  }

  public void setEncrypted(boolean encrypted) {
    this.encrypted = encrypted;
  }
}
