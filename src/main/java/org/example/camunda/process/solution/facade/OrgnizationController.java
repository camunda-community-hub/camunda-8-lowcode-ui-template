package org.example.camunda.process.solution.facade;

import java.io.IOException;
import java.util.Collection;
import org.example.camunda.process.solution.model.Organization;
import org.example.camunda.process.solution.service.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/organization")
public class OrgnizationController {

  private static final Logger LOG = LoggerFactory.getLogger(OrgnizationController.class);

  private final OrganizationService organizationService;

  public OrgnizationController(OrganizationService organizationService) {
    this.organizationService = organizationService;
  }

  @GetMapping
  public Collection<Organization> listOrganizations() {
    return organizationService.all();
  }

  @PostMapping
  public Organization createOrganization() throws IOException {
    String name = "ACME";
    int i = 2;
    while (organizationService.findByName(name) != null) {
      name = "ACME" + i++;
    }
    return organizationService.createOrgnization(name);
  }
}
