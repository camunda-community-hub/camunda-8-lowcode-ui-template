package org.example.camunda.process.solution.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class Organization {

  private String name;

  private Date modified;

  private boolean active;

  private Set<User> users = new HashSet<>();

  private Set<String> groups = new HashSet<>();

  private Set<UserMemberships> userMemberships = new HashSet<>();

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
    return this;
  }

  public Organization addUser(User user) {
    this.users.add(user);
    user.setOrg(this);
    return this;
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

  public Set<UserMemberships> getUserMemberships() {
    return userMemberships;
  }

  public Organization setUserMemberships(Set<UserMemberships> userMemberships) {
    this.userMemberships = userMemberships;
    return this;
  }

  public Date getModified() {
    return modified;
  }

  public Organization setModified(Date modified) {
    this.modified = modified;
    return this;
  }

  public Organization addUserMembership(UserMemberships memberships) {
    this.userMemberships.add(memberships);
    return this;
  }
}
