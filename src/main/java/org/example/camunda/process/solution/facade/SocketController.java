package org.example.camunda.process.solution.facade;

import io.camunda.operate.dto.ProcessDefinition;
import io.camunda.operate.exception.OperateException;
import io.camunda.zeebe.client.ZeebeClient;
import java.util.*;
import org.example.camunda.process.solution.service.OperateService;
import org.example.camunda.process.solution.service.TaskListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@Controller
public class SocketController {

  private static final Logger LOG = LoggerFactory.getLogger(SocketController.class);

  @Autowired private ZeebeClient zeebe;
  @Autowired private OperateService operateService;
  @Autowired private TaskListService taskListService;
  @Autowired private SimpMessagingTemplate simpMessagingTemplate;

  @MessageMapping("/process/{bpmnProcessId}/start")
  public void startProcessInstance(
      @PathVariable String bpmnProcessId, @RequestBody Map<String, Object> variables) {

    LOG.info("Starting process `" + bpmnProcessId + "` with variables: " + variables);

    zeebe
        .newCreateInstanceCommand()
        .bpmnProcessId(bpmnProcessId)
        .latestVersion()
        .variables(variables)
        .send();
  }

  @MessageMapping("/process/definition/latest")
  public void latestDefinitions(@RequestHeader(name = "authToken") String authToken)
      throws OperateException {

    Set<String> present = new HashSet<>();
    List<ProcessDefinition> result = new ArrayList<>();
    List<ProcessDefinition> processDefs = operateService.getProcessDefinitions();
    if (processDefs != null) {
      for (ProcessDefinition def : processDefs) {
        if (!present.contains(def.getBpmnProcessId())) {
          result.add(def);
          present.add(def.getBpmnProcessId());
        }
      }
    }

    // TODO: implement proper jwt tokens
    String userId = authToken;
    simpMessagingTemplate.convertAndSend("/topic/" + userId + "/definitions", result);
  }
}
