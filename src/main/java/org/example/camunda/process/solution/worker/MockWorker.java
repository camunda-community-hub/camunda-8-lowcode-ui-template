package org.example.camunda.process.solution.worker;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.example.camunda.process.solution.ProcessVariables;
import org.example.camunda.process.solution.service.MockService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.spring.client.annotation.ZeebeVariablesAsType;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;

@Component
public class MockWorker {

  private final static Logger LOG = LoggerFactory.getLogger(MockWorker.class);

  @Autowired
  private ZeebeClient client;

  @Autowired
  private MockService mockService;

  @ZeebeWorker(type = "mock", autoComplete = true)
  public ProcessVariables mock(@ZeebeVariablesAsType ProcessVariables variables) throws JsonProcessingException {
    LOG.info("Mock service invoked with variables: " + client.getConfiguration().getJsonMapper().toJson(variables));

    mockService.invoke(variables.getBusinessKey());
    return variables;
  }

}
