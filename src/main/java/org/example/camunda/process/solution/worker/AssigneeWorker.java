package org.example.camunda.process.solution.worker;

import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.client.api.worker.JobClient;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import io.camunda.zeebe.spring.client.annotation.VariablesAsType;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.ProcessVariables;
import org.example.camunda.process.solution.jsonmodel.User;
import org.example.camunda.process.solution.service.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AssigneeWorker {

  private static final Logger LOG = LoggerFactory.getLogger(AssigneeWorker.class);

  @Autowired private OrganizationService organizationService;

  @JobWorker(type = "selectAssignee")
  public ProcessVariables selectAssignee(@VariablesAsType ProcessVariables variables) {
    LOG.info("Invoking myService with variables: " + variables);

    Collection<User> users = organizationService.allUsers();
    int idx = (int) Math.floor(Math.random() * users.size());
    List<User> usersList = new ArrayList<User>(users);
    return new ProcessVariables().setAssignee1(usersList.get(idx).getUsername());
  }

  @JobWorker
  public Map<String, Long> failTask(JobClient client, ActivatedJob job) {
    try {
      return Map.of("result", 3L / 0L);
    } catch (Exception e) {
      client.newThrowErrorCommand(job).errorCode("FAIL").errorMessage("FAIL").send();
      return null;
    }
  }

  @JobWorker
  public void mock() {
    LOG.info("mock");
  }
}
