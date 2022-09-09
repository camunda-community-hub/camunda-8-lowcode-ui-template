package org.example.camunda.process.solution.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import java.util.Objects;

public class User {

  private String username;

  @JsonProperty(access = Access.WRITE_ONLY)
  private String password;

  private String firstname;
  private String lastname;
  private String email;

  @JsonIgnore private Organization org;

  public User() {}

  public User(String username, String password) {
    super();
    this.username = username;
    this.password = password;
  }

  public String getPassword() {
    return password;
  }

  public User setPassword(String password) {
    this.password = password;
    return this;
  }

  public String getUsername() {
    return username;
  }

  public User setUsername(String username) {
    this.username = username;
    return this;
  }

  public String getEmail() {
    return email;
  }

  public User setEmail(String email) {
    this.email = email;
    return this;
  }

  public String getFirstname() {
    return firstname;
  }

  public User setFirstname(String firstname) {
    this.firstname = firstname;
    return this;
  }

  public String getLastname() {
    return lastname;
  }

  public User setLastname(String lastname) {
    this.lastname = lastname;
    return this;
  }

  public Organization getOrg() {
    return org;
  }

  public void setOrg(Organization org) {
    this.org = org;
  }

  @Override
  public int hashCode() {
    return Objects.hash(username);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (getClass() != obj.getClass()) return false;
    User other = (User) obj;
    return Objects.equals(username, other.username);
  }
}
