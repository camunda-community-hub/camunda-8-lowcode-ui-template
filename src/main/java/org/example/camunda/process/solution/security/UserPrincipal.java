package org.example.camunda.process.solution.security;

public class UserPrincipal {

  private String username;

  public UserPrincipal() {
    super();
  }

  public UserPrincipal(String username) {
    super();
    this.username = username;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }
}
