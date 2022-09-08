package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.databind.JsonNode;
import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import org.example.camunda.process.solution.facade.dto.Form;
import org.example.camunda.process.solution.service.FormService;
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
@RequestMapping("/forms")
public class FormsController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(FormsController.class);

  @Autowired private FormService formService;

  @GetMapping("/{processDefinitionId}/{formKey}")
  @ResponseBody
  public JsonNode getFormSchema(
      @PathVariable String processDefinitionId, @PathVariable String formKey)
      throws TaskListException, IOException {

    return getFormSchema(null, processDefinitionId, formKey);
  }

  @GetMapping("/{processName}/{processDefinitionId}/{formKey}")
  @ResponseBody
  public JsonNode getFormSchema(
      @PathVariable String processName,
      @PathVariable String processDefinitionId,
      @PathVariable String formKey)
      throws TaskListException, IOException {

    if (formKey.startsWith("camunda-forms:bpmn:")) {
      String formId = formKey.substring(formKey.lastIndexOf(":") + 1);
      String schema = formService.getEmbeddedFormSchema(processName, processDefinitionId, formId);
      return JsonUtils.toJsonNode(schema);
    }

    Form form = formService.findByName(formKey);
    return form.getSchema();
  }

  @GetMapping("/instanciation/{bpmnProcessId}")
  @ResponseBody
  public JsonNode getInstanciationFormSchema(@PathVariable String bpmnProcessId)
      throws IOException {
    Form form = formService.findByName(bpmnProcessId);
    return form.getSchema();
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
