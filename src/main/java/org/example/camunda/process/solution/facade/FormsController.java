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

@CrossOrigin
@RestController
@RequestMapping("/api/forms")
public class FormsController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(FormsController.class);

  @Autowired private FormService formService;
  @Autowired private BpmnService bpmnService;
  @Autowired private InternationalizationService internationalizationService;

  @IsAuthenticated
  @GetMapping("/{processDefinitionId}/{formKey}")
  @ResponseBody
  public JsonNode getFormSchema(
      @PathVariable String processDefinitionId, @PathVariable String formKey)
      throws TaskListException, IOException, NumberFormatException, OperateException {

    return getFormSchema(null, processDefinitionId, formKey);
  }

  @IsAuthenticated
  @GetMapping("/{processName}/{processDefinitionId}/{formKey}")
  @ResponseBody
  public JsonNode getFormSchema(
      @PathVariable String processName,
      @PathVariable String processDefinitionId,
      @PathVariable String formKey)
      throws TaskListException, IOException, NumberFormatException, OperateException {

    return getFormSchema(null, processDefinitionId, formKey, null);
  }

  @IsAuthenticated
  @GetMapping("/{processName}/{processDefinitionId}/{formKey}/{locale}")
  @ResponseBody
  public JsonNode getFormSchema(
      @PathVariable String processName,
      @PathVariable String processDefinitionId,
      @PathVariable String formKey,
      @PathVariable String locale)
      throws TaskListException, IOException, NumberFormatException, OperateException {

    if (formKey.startsWith("camunda-forms:bpmn:")) {
      String formId = formKey.substring(formKey.lastIndexOf(":") + 1);
      String schema = bpmnService.getEmbeddedFormSchema(processName, processDefinitionId, formId);
      JsonNode formSchema = JsonUtils.toJsonNode(schema);
      if (locale != null) {
        internationalizationService.translateFormSchema(formSchema, locale);
      }
      return formSchema;
    }

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
  @GetMapping("/instanciation/{bpmnProcessId}")
  @ResponseBody
  public JsonNode getInstanciationFormSchema(@PathVariable String bpmnProcessId)
      throws IOException {
    Form form = formService.findByName(bpmnProcessId);
    ObjectNode schemaModif = (ObjectNode) form.getSchema();
    schemaModif.put("generator", "formJs");
    if (form.getGenerator() != null) {
      schemaModif.put("generator", form.getGenerator());
    }
    return schemaModif;
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
