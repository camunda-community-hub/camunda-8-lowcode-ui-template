package org.example.camunda.process.solution.worker;

import io.camunda.zeebe.spring.client.annotation.ZeebeVariablesAsType;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;
import java.util.List;
import org.example.camunda.process.solution.ProcessVariables;
import org.example.camunda.process.solution.model.User;
import org.example.camunda.process.solution.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MyWorker {

  private static final Logger LOG = LoggerFactory.getLogger(MyWorker.class);

  @Autowired private UserService userService;

  @ZeebeWorker(type = "selectAssignee", autoComplete = true)
  public ProcessVariables invokeMyService(@ZeebeVariablesAsType ProcessVariables variables) {
    LOG.info("Invoking myService with variables: " + variables);

    List<User> users = userService.all();
    int idx = (int) Math.floor(Math.random() * users.size());

    return new ProcessVariables().setAssignee1(users.get(idx).getUsername());
  }
}
