package org.example.camunda.process.solution.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Organization {

  private String name;

  private Date modified;

  private boolean active;

  private boolean cryptPassword = true;

  private Set<User> users = new HashSet<>();

  private Set<String> groups = new HashSet<>();

  @JsonIgnore Map<String, User> userMap = new HashMap<>();

  public String getName() {
    return name;
  }

  public Organization setName(String name) {
    this.name = name;
    return this;
  }

  public boolean isActive() {
    return active;
  }

  public Organization setActive(boolean active) {
    this.active = active;
    return this;
  }

  public Set<User> getUsers() {
    return users;
  }

  public Organization setUsers(Set<User> users) {
    this.users = users;
    for (User user : users) {
      this.userMap.put(user.getUsername(), user);
    }
    return this;
  }

  public Organization addUser(User user) {
    this.users.add(user);
    this.userMap.put(user.getUsername(), user);
    return this;
  }

  public User getUser(String username) {
    return this.userMap.get(username);
  }

  public Set<String> getGroups() {
    return groups;
  }

  public Organization setGroups(Set<String> groups) {
    this.groups = groups;
    return this;
  }

  public Organization addGroup(String group) {
    this.groups.add(group);
    return this;
  }

  public Organization addGroups(String... groups) {
    for (String group : groups) {
      this.groups.add(group);
    }
    return this;
  }

  public Date getModified() {
    return modified;
  }

  public Organization setModified(Date modified) {
    this.modified = modified;
    return this;
  }

  public boolean isCryptPassword() {
    return cryptPassword;
  }

  public void setCryptPassword(boolean cryptPassword) {
    this.cryptPassword = cryptPassword;
  }
}
