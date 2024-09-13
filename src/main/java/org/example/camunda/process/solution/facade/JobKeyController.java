package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.camunda.operate.exception.OperateException;
import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.facade.dto.TaskSearch;
import org.example.camunda.process.solution.jsonmodel.Form;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
import org.example.camunda.process.solution.service.BpmnService;
import org.example.camunda.process.solution.service.FormService;
import org.example.camunda.process.solution.service.SseEmitterManager;
import org.example.camunda.process.solution.service.TaskListService;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@CrossOrigin
@RestController
@RequestMapping("/api/jobKey")
public class JobKeyController {
  @Autowired private TaskListService tasklistService;
  @Autowired private BpmnService bpmnService;
  @Autowired private FormService formService;

  @GetMapping("/tasks/{userId}")
  public SseEmitter streamSse(@PathVariable String userId) {

    return SseEmitterManager.getEmitter(userId);
  }

  @GetMapping("/form/{processDefinitionKey}/{taskDefId}")
  @ResponseBody
  public JsonNode getJobKeyForm(
      @PathVariable String processDefinitionKey, @PathVariable String taskDefId)
      throws TaskListException, IOException, NumberFormatException, OperateException {
    List<Task> tasks =
        tasklistService.getTasks(
            new TaskSearch()
                .setTaskDefinitionId(taskDefId)
                .setProcessDefinitionKey(processDefinitionKey)
                .setPageSize(1));
    for (Task task : tasks) {
      if (task.getFormId() != null) {
        return JsonUtils.toJsonNode(
            tasklistService.getForm(task.getProcessDefinitionKey(), task.getFormId()));
      }
      if (task.getFormKey() != null) {
        String formKey = task.getFormKey();
        if (formKey.startsWith("camunda-forms:bpmn:")) {
          formKey = formKey.substring(formKey.lastIndexOf(":") + 1);
        }
        String schemaStr =
            bpmnService.getEmbeddedFormSchema(task.getProcessDefinitionKey(), formKey);
        if (schemaStr != null) {
          return JsonUtils.toJsonNode(schemaStr);
        }
        Form form = formService.findByName(formKey);
        JsonNode schema = form.getSchema();
        ObjectNode schemaModif = (ObjectNode) schema;
        schemaModif.put("generator", "formJs");
        if (form.getGenerator() != null) {
          schemaModif.put("generator", form.getGenerator());
        }
      }
    }
    return null;
  }

  @IsAuthenticated
  @PostMapping("/{jobKey}")
  public void completeTaskWithJobKey(
      @PathVariable Long jobKey, @RequestBody Map<String, Object> variables)
      throws TaskListException {
    // TODO : find a more elegant solution for the comments
    variables.remove(ProcessController.COMMENTS_KEY);
    tasklistService.completeTaskWithJobKey(jobKey, variables);
  }
}
