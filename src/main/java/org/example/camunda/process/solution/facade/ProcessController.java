package org.example.camunda.process.solution.facade;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import org.example.camunda.process.solution.ProcessConstants;
import org.example.camunda.process.solution.service.MyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/process")
public class ProcessController {

  private static final Logger LOG = LoggerFactory.getLogger(ProcessController.class);
  @Autowired private MyService myService;

  @PostMapping("/startSync")
  public Object startProcessInstanceSync(@RequestBody Map<String, Object> variables) {

    LOG.info(
        "Starting process `" + ProcessConstants.BPMN_PROCESS_ID + "` with variables: " + variables);

    return myService.startProcessInstance(variables).join(); // .join to make it sync
  }

  @PostMapping("/update/{myId}")
  public Object updateProcessInstanceSync(@PathVariable String myId) {

    LOG.info("Updating for myId `{}`", myId);

    return myService.updateProcessInstance(myId).join(); // .join to make it sync
  }

  @PostMapping("/start")
  public CompletableFuture<?> startProcessInstance(@RequestBody Map<String, Object> variables) {

    LOG.info(
        "Starting process `" + ProcessConstants.BPMN_PROCESS_ID + "` with variables: " + variables);

    return myService.startProcessInstance(variables);
  }

  @PostMapping("/update/{myId}")
  public CompletableFuture<?> updateProcessInstance(@PathVariable String myId) {

    LOG.info("Updating for myId `{}`", myId);

    return myService.updateProcessInstance(myId);
  }
}
