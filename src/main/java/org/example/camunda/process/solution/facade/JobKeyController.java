package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.databind.JsonNode;
import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.facade.dto.TaskSearch;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
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

  @GetMapping("/tasks/{userId}")
  public SseEmitter streamSse(@PathVariable String userId) {

    return SseEmitterManager.getEmitter(userId);
  }

  @GetMapping("/form/{processDefinitionKey}/{taskDefId}")
  @ResponseBody
  public JsonNode getJobKeyForm(
      @PathVariable String processDefinitionKey, @PathVariable String taskDefId)
      throws TaskListException, IOException {
    List<Task> tasks =
        tasklistService.getTasks(
            new TaskSearch()
                .setTaskDefinitionId(taskDefId)
                .setProcessDefinitionKey(processDefinitionKey)
                .setPageSize(1));
    for (Task task : tasks) {
      return JsonUtils.toJsonNode(
          tasklistService.getForm(task.getProcessDefinitionKey(), task.getFormId()));
    }
    return null;
  }

  @IsAuthenticated
  @PostMapping("/{jobKey}")
  public void completeTaskWithJobKey(
      @PathVariable Long jobKey, @RequestBody Map<String, Object> variables)
      throws TaskListException {

    tasklistService.completeTaskWithJobKey(jobKey, variables);
  }
}
