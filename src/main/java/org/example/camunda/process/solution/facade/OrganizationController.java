package org.example.camunda.process.solution.facade;

import java.io.IOException;
import java.util.Collection;
import java.util.Map;
import org.example.camunda.process.solution.exception.TechnicalException;
import org.example.camunda.process.solution.jsonmodel.Organization;
import org.example.camunda.process.solution.security.annotation.IsAdmin;
import org.example.camunda.process.solution.service.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/organization")
public class OrganizationController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(FormsEditionController.class);

  private final OrganizationService organizationService;

  public OrganizationController(OrganizationService organizationService) {
    this.organizationService = organizationService;
  }

  @IsAdmin
  @GetMapping
  public Collection<Organization> listOrganizations() {
    return organizationService.all();
  }

  @IsAdmin
  @PostMapping
  public Organization createOrganization() throws IOException {
    String name = "ACME";
    int i = 2;
    while (organizationService.findByName(name) != null) {
      name = "ACME" + i++;
    }
    return organizationService.createOrganization(name, false);
  }

  @IsAdmin
  @PostMapping("/active/{orgName}")
  public Organization setActive(@PathVariable String orgName) throws IOException {
    return organizationService.activate(orgName, true);
  }

  @IsAdmin
  @PutMapping("/{orgName}")
  public Organization updateOrganization(
      @PathVariable String orgName, @RequestBody Organization org) throws IOException {
    if (organizationService.findByName(orgName) == null) {
      throw new TechnicalException("Orgnization doesn't exist.");
    }
    if (orgName.equals(org.getName())) {
      organizationService.rename(orgName, org.getName());
    }
    return organizationService.saveOrganization(org);
  }

  @IsAdmin
  @GetMapping("enabled")
  public Map<String, Object> enabled() {
    if (isKeycloakAuth()) {
      return Map.of("enabled", false);
    }
    return Map.of("enabled", true);
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
