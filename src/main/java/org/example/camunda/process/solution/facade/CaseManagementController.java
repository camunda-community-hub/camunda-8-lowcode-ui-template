package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.camunda.operate.exception.OperateException;
import io.camunda.operate.model.ProcessDefinition;
import io.camunda.operate.model.ProcessInstance;
import io.camunda.zeebe.client.ZeebeClient;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.casemgmt.CaseManagementConfiguration;
import org.example.camunda.process.solution.facade.dto.casemgmt.MessageConf;
import org.example.camunda.process.solution.jsonmodel.Form;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
import org.example.camunda.process.solution.security.annotation.IsEditor;
import org.example.camunda.process.solution.service.FormService;
import org.example.camunda.process.solution.service.InternationalizationService;
import org.example.camunda.process.solution.service.OperateService;
import org.example.camunda.process.solution.service.casemgmt.CaseMgmtService;
import org.example.camunda.process.solution.utils.FeelUtils;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/casemgmt")
public class CaseManagementController {

  private static final Logger LOG = LoggerFactory.getLogger(CaseManagementController.class);
  private final CaseMgmtService caseMgmtService;
  private final OperateService operateService;
  private final FormService formService;
  private final InternationalizationService internationalizationService;
  private final ZeebeClient zeebeClient;

  public CaseManagementController(
      CaseMgmtService caseMgmtService,
      OperateService operateService,
      FormService formService,
      InternationalizationService internationalizationService,
      ZeebeClient zeebeClient) {
    this.caseMgmtService = caseMgmtService;
    this.operateService = operateService;
    this.formService = formService;
    this.internationalizationService = internationalizationService;
    this.zeebeClient = zeebeClient;
  }

  @IsEditor
  @GetMapping
  public CaseManagementConfiguration getConf() throws IOException {
    return caseMgmtService.get();
  }

  @IsEditor
  @PostMapping
  public CaseManagementConfiguration save(@RequestBody CaseManagementConfiguration conf)
      throws IOException {
    return caseMgmtService.save(conf);
  }

  @IsAuthenticated
  @GetMapping("/messages/{bpmnProcessId}")
  public List<MessageConf> getMessages(@PathVariable String bpmnProcessId) throws IOException {
    return caseMgmtService.getMessagesConf(bpmnProcessId);
  }

  @IsAuthenticated
  @GetMapping("/messages/{processDefinitionKey}/{elementId}")
  public List<MessageConf> getMessages(
      @PathVariable Long processDefinitionKey, @PathVariable String elementId)
      throws IOException, OperateException {
    ProcessDefinition def = operateService.getProcessDefinition(processDefinitionKey);
    return caseMgmtService.getMessagesConf(def.getBpmnProcessId(), elementId);
  }

  @IsAuthenticated
  @GetMapping("/form/{formKey}")
  public JsonNode getMessageForm(
      @PathVariable String formKey, @RequestParam(required = false) String ln) throws IOException {

    Form form = formService.findByName(formKey);
    JsonNode schema = form.getSchema();
    ObjectNode schemaModif = (ObjectNode) schema;
    schemaModif.put("generator", "formJs");
    if (form.getGenerator() != null) {
      schemaModif.put("generator", form.getGenerator());
    }
    if (ln != null) {
      internationalizationService.translateFormSchema(schema, ln);
    }
    return schema;
  }

  @IsAuthenticated
  @PostMapping("/message/{message}/{processInstanceKey}")
  public Map<String, String> publishMessage(
      @PathVariable String message,
      @PathVariable Long processInstanceKey,
      @RequestBody Map<String, Object> variables)
      throws IOException, OperateException {
    ProcessInstance instance = operateService.getProcessInstance(processInstanceKey);
    ProcessDefinition def = operateService.getProcessDefinition(instance.getProcessDefinitionKey());
    MessageConf conf = caseMgmtService.getConfByMessage(def.getBpmnProcessId(), message);
    if (conf == null) {
      return Map.of("status", "danger", "message", "This message is not configured to be executed");
    }
    Map<String, Object> instanceVariables = operateService.getVariablesAsMap(processInstanceKey);
    try {
      String jsonCorrelationKey =
          (String) FeelUtils.evaluate(conf.getCorrelationKey().substring(1), instanceVariables);
      String correlationKey = JsonUtils.toObject(jsonCorrelationKey, String.class);
      zeebeClient
          .newPublishMessageCommand()
          .messageName(message)
          .correlationKey(correlationKey)
          .variables(variables)
          .send()
          .join();
      return Map.of(
          "status",
          "success",
          "message",
          "This message has been executed. You can now close this window.");
    } catch (Exception e) {
      return Map.of(
          "status",
          "danger",
          "message",
          "This message couldn't be executed : " + e.getLocalizedMessage());
    }
  }
}
