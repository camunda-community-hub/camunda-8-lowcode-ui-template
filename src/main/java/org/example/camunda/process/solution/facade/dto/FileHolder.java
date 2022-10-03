package org.example.camunda.process.solution.facade.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.nio.file.Path;

public class FileHolder {

  private String reference;

  private String name;

  private String contentType;

  @JsonIgnore private Path path;

  public String getReference() {
    return reference;
  }

  public FileHolder setReference(String reference) {
    this.reference = reference;
    return this;
  }

  public String getName() {
    return name;
  }

  public FileHolder setName(String name) {
    this.name = name;
    return this;
  }

  public Path getPath() {
    return path;
  }

  public FileHolder setPath(Path path) {
    this.path = path;
    return this;
  }

  public String getContentType() {
    return contentType;
  }

  public FileHolder setContentType(String contentType) {
    this.contentType = contentType;
    return this;
  }
}
