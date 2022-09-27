package org.example.camunda.process.solution.jsonmodel;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class User {

  private String username;
  private Password password;
  private String firstname;
  private String lastname;
  private String email;

  private String profile;

  private Set<String> groups = new HashSet<>();

  public User() {}

  public User(String username, String password) {
    super();
    this.username = username;
    this.password = new Password(password);
  }

  public Password getPassword() {
    return password;
  }

  public User setPassword(Password password) {
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

  public String getProfile() {
    return profile;
  }

  public User setProfile(String profile) {
    this.profile = profile;
    return this;
  }

  public Set<String> getGroups() {
    return groups;
  }

  public User setGroups(Set<String> groups) {
    this.groups = groups;
    return this;
  }

  public User addGroup(String group) {
    this.groups.add(group);
    return this;
  }

  public User addGroups(String... groups) {
    for (String group : groups) {
      this.groups.add(group);
    }
    return this;
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
