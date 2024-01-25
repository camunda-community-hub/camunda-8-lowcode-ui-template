package org.example.camunda.process.solution.jsonmodel;

import java.util.Date;
import java.util.Map;

public class Theme {

  private String name;

  private String logo;

  private String logoCss;

  private String background;

  private Date modified;

  private Map<String, String> variables;

  private String colors;

  private String content;

  private boolean active;

  public Theme() {}

  public Theme(String name, String colors) {
    super();
    this.name = name;
    this.colors = colors;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLogo() {
    return logo;
  }

  public void setLogo(String logo) {
    this.logo = logo;
  }

  public String getLogoCss() {
    return logoCss;
  }

  public void setLogoCss(String logoCss) {
    this.logoCss = logoCss;
  }

  public String getBackground() {
    return background;
  }

  public void setBackground(String background) {
    this.background = background;
  }

  public Date getModified() {
    return modified;
  }

  public void setModified(Date modified) {
    this.modified = modified;
  }

  public Map<String, String> getVariables() {
    return variables;
  }

  public void setVariables(Map<String, String> variables) {
    this.variables = variables;
  }

  public String getColors() {
    return colors;
  }

  public void setColors(String colors) {
    this.colors = colors;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public String getImgs(String serverHost, String uri) {
    return ".logo {background: url("
        + serverHost
        + uri
        + "/logo/"
        + logo
        + ") no-repeat; background-size: contain; "
        + logoCss
        + "}"
        + ".bg {background: url("
        + serverHost
        + uri
        + "/bg/"
        + background
        + ") no-repeat center bottom fixed; background-size: cover;}";
  }
}
