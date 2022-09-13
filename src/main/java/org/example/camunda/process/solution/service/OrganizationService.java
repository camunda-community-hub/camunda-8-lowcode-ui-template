package org.example.camunda.process.solution.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;
import org.example.camunda.process.solution.exception.TechnicalException;
import org.example.camunda.process.solution.exception.UnauthorizedException;
import org.example.camunda.process.solution.model.Organization;
import org.example.camunda.process.solution.model.User;
import org.example.camunda.process.solution.model.UserMemberships;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {

  private static final Logger LOG = LoggerFactory.getLogger(OrganizationService.class);

  public static final String ORGS = "organizations";

  Map<String, Organization> organizations = new HashMap<>();

  Map<String, User> users = new HashMap<>();
  Map<String, UserMemberships> usersMemberships = new HashMap<>();

  @Value("${workspace:workspace}")
  private String workspace;

  public Path resolveOrganization(String name) {
    return Path.of(workspace).resolve(ORGS).resolve(name);
  }

  public List<String> findNames() {
    return Stream.of(Path.of(workspace).resolve(ORGS).toFile().listFiles())
        .map(File::getName)
        .collect(Collectors.toList());
  }

  public Organization findByName(String orgName) throws IOException {
    try {
      Organization org = JsonUtils.fromJsonFile(resolveOrganization(orgName), Organization.class);
      for (User u : org.getUsers()) {
        u.setOrg(org);
      }
      return org;
    } catch (FileNotFoundException e) {
      return null;
    }
  }

  public Organization saveOrganization(Organization org) throws IOException {
    org.setModified(new Date());
    JsonUtils.toJsonFile(resolveOrganization(org.getName()), org);
    organizations.put(org.getName(), org);
    return org;
  }

  public void saveOrganizations() throws IOException {
    for (Organization org : organizations.values()) {
      saveOrganization(org);
    }
  }

  public void deleteByName(String name) throws IOException {
    Files.delete(resolveOrganization(name));
    organizations.remove(name);
  }

  public User getUserByUsername(String username) {
    return users.get(username);
  }

  public User create(User user) {
    if (getUserByUsername(user.getUsername()) != null) {
      throw new UnauthorizedException("User already exists");
    }
    if (user.getOrg() == null) {
      throw new TechnicalException("User should be part of an Organization");
    }
    // user.setPassword(SecurityUtils.cryptPwd(user.getPassword()));
    user.getOrg().getUsers().add(user);

    users.put(user.getUsername(), user);
    return user;
  }

  public User update(User user) {
    User original = getUserByUsername(user.getUsername());
    if (original == null) {
      throw new UnauthorizedException("Account doesn't exists");
    }
    // user.setPassword(SecurityUtils.cryptPwd(user.getPassword()));
    BeanUtils.copyProperties(user, original, "org");

    return original;
  }

  @PostConstruct
  private void loadOrganizations() throws IOException {
    File[] orgs = Path.of(workspace).resolve(ORGS).toFile().listFiles();
    if (orgs != null) {
      for (File file : orgs) {
        Organization org = JsonUtils.fromJsonFile(file.toPath(), Organization.class);
        organizations.put(org.getName(), org);
        if (org.isActive()) {
          activate(org.getName(), true);
        }
      }
    }
    if (users.isEmpty()) {
      User demo =
          new User("demo", "demo")
              .setFirstname("De")
              .setLastname("Mo")
              .setEmail("christophe.dame@camunda.com");
      createOrgnization("ACME", true, demo);
    }
  }

  public Organization createOrgnization(String name, boolean active, User... admins)
      throws IOException {
    Organization org =
        new Organization()
            .setName(name)
            .setActive(active)
            .addGroups("HR", "IT", "Finance", "Sales");
    for (User user : admins) {
      org.addUser(user);
      org.addUserMembership(
          new UserMemberships(user.getUsername()).setProfile("Admin").addGroups("HR", "IT"));
    }
    return saveOrganization(org);
  }

  public Collection<Organization> all() {
    return organizations.values();
  }

  public Collection<User> allUsers() {
    return users.values();
  }

  public UserMemberships getUserMemberships(User user) {
    return usersMemberships.get(user.getUsername());
  }

  public void saveUserMemberships(UserMemberships userMemberships) {
    User u = users.get(userMemberships.getUsername());
    Organization org = u.getOrg();
    org.getUserMemberships().add(userMemberships);
    usersMemberships.put(u.getUsername(), userMemberships);
  }

  public Organization activate(String orgName, boolean persist) throws IOException {
    Organization orga = null;
    users.clear();
    usersMemberships.clear();
    for (Organization org : organizations.values()) {
      org.setActive(false);
      if (org.getName().equals(orgName)) {
        orga = org;
        org.setActive(true);
      }
    }
    for (User u : orga.getUsers()) {
      u.setOrg(orga);
      users.put(u.getUsername(), u);
    }
    for (UserMemberships membership : orga.getUserMemberships()) {
      usersMemberships.put(membership.getUsername(), membership);
    }
    if (persist) {
      saveOrganizations();
    }
    return orga;
  }
}
