package org.example.camunda.process.solution.facade;

import io.camunda.tasklist.rest.exception.TaskListException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.example.camunda.process.solution.facade.dto.FormJsListValue;
import org.example.camunda.process.solution.jsonmodel.User;
import org.example.camunda.process.solution.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/simul")
public class SimulationController {

  @Autowired private OrganizationService organizationService;

  @GetMapping("/users")
  public List<FormJsListValue> users() throws TaskListException, IOException {

    Collection<User> users = organizationService.allUsers();
    List<FormJsListValue> result = new ArrayList<>();
    for (User u : users) {
      result.add(new FormJsListValue(u.getUsername(), u.getFirstname() + " " + u.getLastname()));
    }
    return result;
  }

  @GetMapping("/checklist")
  public List<FormJsListValue> getChecklist() {
    return List.of(new FormJsListValue("1", "choice 1"), new FormJsListValue("2", "choice 2"));
  }
}
