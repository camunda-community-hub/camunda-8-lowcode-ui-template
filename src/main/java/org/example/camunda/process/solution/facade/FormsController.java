package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.camunda.operate.exception.OperateException;
import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import org.example.camunda.process.solution.jsonmodel.Form;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
import org.example.camunda.process.solution.service.BpmnService;
import org.example.camunda.process.solution.service.FormService;
import org.example.camunda.process.solution.service.InternationalizationService;
import org.example.camunda.process.solution.service.OperateService;
import org.example.camunda.process.solution.service.TaskListService;
import org.example.camunda.process.solution.utils.BpmnUtils;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@CrossOrigin
@RestController
@RequestMapping("/api/forms")
public class FormsController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(FormsController.class);

  @Autowired private FormService formService;
  @Autowired private BpmnService bpmnService;
  @Autowired private OperateService operateService;
  @Autowired private TaskListService tasklistService;
  @Autowired private InternationalizationService internationalizationService;

  @IsAuthenticated
  @GetMapping("/{processDefinitionId}/{formKey}/{locale}")
  @ResponseBody
  public JsonNode getCustomFormSchema(
      @PathVariable String processDefinitionId,
      @PathVariable String formKey,
      @PathVariable String locale)
      throws TaskListException, IOException, NumberFormatException, OperateException {

    Form form = formService.findByName(formKey);
    JsonNode schema = form.getSchema();
    ObjectNode schemaModif = (ObjectNode) schema;
    schemaModif.put("generator", "formJs");
    if (form.getGenerator() != null) {
      schemaModif.put("generator", form.getGenerator());
    }
    if (locale != null) {
      internationalizationService.translateFormSchema(schema, locale);
    }
    return schema;
  }

  @IsAuthenticated
  @GetMapping("/{processDefinitionId}/embedded/{formKey}/{locale}")
  @ResponseBody
  public JsonNode getEmbeddedFormSchema(
      @PathVariable String processDefinitionId,
      @PathVariable String formKey,
      @PathVariable String locale)
      throws TaskListException, IOException, NumberFormatException, OperateException {

    if (formKey.startsWith("camunda-forms:bpmn:")) {
      formKey = formKey.substring(formKey.lastIndexOf(":") + 1);
    }
    String schema = bpmnService.getEmbeddedFormSchema(processDefinitionId, formKey);
    JsonNode formSchema = JsonUtils.toJsonNode(schema);
    if (locale != null) {
      internationalizationService.translateFormSchema(formSchema, locale);
    }
    return formSchema;
  }

  @IsAuthenticated
  @GetMapping("/{processDefinitionId}/linked/{formId}/{locale}")
  @ResponseBody
  public JsonNode getLinkedFormSchema(
      @PathVariable String processDefinitionId,
      @PathVariable String formId,
      @PathVariable String locale)
      throws TaskListException, IOException, NumberFormatException, OperateException {

    String schema = tasklistService.getForm(processDefinitionId, formId);

    JsonNode formSchema = JsonUtils.toJsonNode(schema);
    if (locale != null) {
      internationalizationService.translateFormSchema(formSchema, locale);
    }
    return formSchema;
  }

  @IsAuthenticated
  @GetMapping("/instanciation/{bpmnProcessId}/{processDefinitionId}")
  @ResponseBody
  public JsonNode getInstanciationFormSchema(
      @PathVariable String processDefinitionId, @PathVariable String bpmnProcessId)
      throws IOException, NumberFormatException, OperateException {
    String schema = getInitializationForm(processDefinitionId);
    if (schema != null) {
      return JsonUtils.toJsonNode(schema);
    }
    Form form = formService.findByName(bpmnProcessId);
    if (form == null) {
      return null;
    }
    ObjectNode schemaModif = (ObjectNode) form.getSchema();
    schemaModif.put("generator", "formJs");
    if (form.getGenerator() != null) {
      schemaModif.put("generator", form.getGenerator());
    }
    return schemaModif;
  }

  private String getInitializationForm(String processDefinitionId)
      throws NumberFormatException, OperateException {
    String xml = operateService.getProcessDefinitionXmlByKey(Long.valueOf(processDefinitionId));
    Document xmlDoc = BpmnUtils.getXmlDocument(xml);
    String embeddedFormKey = BpmnUtils.getEmbeddedStartingFormKey(xmlDoc);
    if (embeddedFormKey != null) {
      return BpmnUtils.getEmbeddedSartingFormSchema(xmlDoc, embeddedFormKey);
    }
    String linkedFormKey = BpmnUtils.getLinkedStartingFormId(xmlDoc);
    if (linkedFormKey != null) {
      try {
        return tasklistService.getForm(processDefinitionId, linkedFormKey);
      } catch (TaskListException e) {
        return null;
      }
    }
    return null;
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
