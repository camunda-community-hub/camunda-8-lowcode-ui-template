package org.example.camunda.process.solution.worker;

import io.camunda.zeebe.spring.client.annotation.ZeebeVariablesAsType;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;
import org.example.camunda.process.solution.ProcessVariables;
import org.example.camunda.process.solution.service.MyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MyWorker {

  private static final Logger LOG = LoggerFactory.getLogger(MyWorker.class);

  @Autowired private MyService myService;

  @ZeebeWorker(type = "my-service", autoComplete = true)
  public ProcessVariables invokeMyService(@ZeebeVariablesAsType ProcessVariables variables) {
    LOG.info("Invoking myService with variables: " + variables);

    boolean result = myService.myOperation(variables.getBusinessKey());

    return new ProcessVariables()
        .setResult(result); // new object to avoid sending unchanged variables
  }
}
