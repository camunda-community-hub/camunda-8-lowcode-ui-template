package org.example.camunda.process.solution.facade;

import io.camunda.operate.dto.ProcessDefinition;
import io.camunda.operate.exception.OperateException;
import io.camunda.zeebe.client.ZeebeClient;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.example.camunda.process.solution.service.OperateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/process")
public class ProcessController {

  private static final Logger LOG = LoggerFactory.getLogger(ProcessController.class);
  private final ZeebeClient zeebe;
  private final OperateService operateService;

  public ProcessController(ZeebeClient client, OperateService operateService) {
    this.zeebe = client;
    this.operateService = operateService;
  }

  @PostMapping("/{bpmnProcessId}/start")
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

  @PostMapping("/message/{messageName}/{correlationKey}")
  public void publishMessage(
      @PathVariable String messageName,
      @PathVariable String correlationKey,
      @RequestBody Map<String, Object> variables) {

    LOG.info(
        "Publishing message `{}` with correlation key `{}` and variables: {}",
        messageName,
        correlationKey,
        variables);

    zeebe
        .newPublishMessageCommand()
        .messageName(messageName)
        .correlationKey(correlationKey)
        .variables(variables)
        .send();
  }

  @GetMapping("/definition/latest")
  public List<ProcessDefinition> latestDefinitions() throws OperateException {
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
    return result;
  }
}
