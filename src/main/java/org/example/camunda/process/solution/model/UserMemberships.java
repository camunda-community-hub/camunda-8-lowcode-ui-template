package org.example.camunda.process.solution.model;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class UserMemberships {

  private String username;

  private String profile;

  private Set<String> groups = new HashSet<>();

  public UserMemberships() {
    super();
  }

  public UserMemberships(String username) {
    super();
    this.username = username;
  }

  public String getUsername() {
    return username;
  }

  public UserMemberships setUsername(String username) {
    this.username = username;
    return this;
  }

  public String getProfile() {
    return profile;
  }

  public UserMemberships setProfile(String profile) {
    this.profile = profile;
    return this;
  }

  public Set<String> getGroups() {
    return groups;
  }

  public UserMemberships setGroups(Set<String> groups) {
    this.groups = groups;
    return this;
  }

  public UserMemberships addGroup(String group) {
    this.groups.add(group);
    return this;
  }

  public UserMemberships addGroups(String... groups) {
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
    UserMemberships other = (UserMemberships) obj;
    return Objects.equals(username, other.username);
  }
}
