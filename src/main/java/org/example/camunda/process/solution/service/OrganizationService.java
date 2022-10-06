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
import org.example.camunda.process.solution.jsonmodel.Organization;
import org.example.camunda.process.solution.jsonmodel.User;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {

  private static final Logger LOG = LoggerFactory.getLogger(OrganizationService.class);

  public static final String ORGS = "organizations";

  private Organization activeOrg = null;

  Map<String, Organization> organizations = new HashMap<>();

  @Value("${workspace:workspace}")
  private String workspace;

  private static BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

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

      return org;
    } catch (FileNotFoundException e) {
      return null;
    }
  }

  public Organization saveOrganization(Organization org) throws IOException {
    org.setModified(new Date());
    if (org.isCryptPassword()) {
      for (User user : org.getUsers()) {
        if (!user.getPassword().isEncrypted()) {
          user.getPassword().setValue(bCryptPasswordEncoder.encode(user.getPassword().getValue()));
          user.getPassword().setEncrypted(true);
        }
      }
    }
    JsonUtils.toJsonFile(resolveOrganization(org.getName()), org);
    organizations.put(org.getName(), org);
    if (org.isActive()) {
      activeOrg = org;
    }
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

  public Organization rename(String oldName, String newName) throws IOException {
    Organization org = organizations.get(oldName);
    org.setName(newName);
    deleteByName(oldName);
    return saveOrganization(org);
  }

  public User getUserByUsernameAndPassword(String username, String password) {
    User user = activeOrg.getUser(username);
    if (user != null) {
      if (!activeOrg.isCryptPassword() && user.getPassword().getValue().equals(password)) {
        return user;
      }
      if (activeOrg.isCryptPassword()
          && bCryptPasswordEncoder.matches(password, user.getPassword().getValue())) {
        return user;
      }
    }
    return null;
  }

  public User getUserByUsername(String username) {
    return activeOrg.getUser(username);
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
    if (organizations.isEmpty()) {
      User demo =
          new User("demo", "demo")
              .setFirstname("De")
              .setLastname("Mo")
              .setEmail("christophe.dame@camunda.com")
              .setProfile("Admin")
              .addGroups("HR", "IT");
      activeOrg = createOrganization("ACME", true, demo);
    }
  }

  public Organization createOrganization(String name, boolean active, User... users)
      throws IOException {
    Organization org =
        new Organization()
            .setName(name)
            .setActive(active)
            .addGroups("HR", "IT", "Finance", "Sales");
    for (User user : users) {
      org.addUser(user);
    }
    return saveOrganization(org);
  }

  public Collection<Organization> all() {
    return organizations.values();
  }

  public Collection<User> allUsers() {
    return activeOrg.getUsers();
  }

  public Organization activate(String orgName, boolean persist) throws IOException {
    activeOrg = organizations.get(orgName);

    for (Organization org : organizations.values()) {
      org.setActive(false);
    }
    activeOrg.setActive(true);

    if (persist) {
      saveOrganizations();
    }
    return activeOrg;
  }
}
