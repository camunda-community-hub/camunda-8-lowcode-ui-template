package org.example.camunda.process.solution.worker;

import org.example.camunda.process.solution.ProcessVariables;
import org.example.camunda.process.solution.service.MyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.camunda.zeebe.client.api.JsonMapper;
import io.camunda.zeebe.spring.client.annotation.ZeebeVariablesAsType;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;

@Component
public class MyWorker {

  private final static Logger LOG = LoggerFactory.getLogger(MyWorker.class);

  @Autowired
  private JsonMapper mapper; // just for logging variables

  @Autowired
  private MyService myService;

  @ZeebeWorker(type = "my-service", autoComplete = true)
  public ProcessVariables invokeMyService(@ZeebeVariablesAsType ProcessVariables variables) {
    LOG.info("Invoking myService with variables: " + mapper.toJson(variables));

    boolean result = myService.myOperation(variables.getBusinessKey());
    variables.setResult(result);
    return variables;
  }

}
