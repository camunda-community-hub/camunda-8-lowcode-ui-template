package org.example.camunda.process.solution.worker;

import io.camunda.zeebe.spring.client.annotation.JobWorker;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MyJobWorker {

  private static final Logger LOG = LoggerFactory.getLogger(MyJobWorker.class);

  @JobWorker(type = "task-1")
  public Map<String, Object> task1() {
    LOG.info("Invoking JobWorker for task-1: ");
    Map<String, Object> processVars = new HashMap<>();

    processVars.put("someRandomUUID", UUID.randomUUID());
    processVars.put("answer", 42);

    return processVars;
  }
}
