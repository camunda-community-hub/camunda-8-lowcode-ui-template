package org.example.camunda.process.solution.facade;

import io.camunda.tasklist.exception.TaskListException;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.facade.dto.TaskSearch;
import org.example.camunda.process.solution.model.TaskToken;
import org.example.camunda.process.solution.security.SecurityUtils;
import org.example.camunda.process.solution.security.annontation.IsAuthenticated;
import org.example.camunda.process.solution.service.TaskListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  private static final Logger LOG = LoggerFactory.getLogger(TaskController.class);

  @Autowired private TaskListService taskListService;

  @IsAuthenticated
  @GetMapping()
  public List<Task> getTasks() throws TaskListException {
    return taskListService.getTasks(null, null);
  }

  @IsAuthenticated
  @GetMapping("/token/{token}")
  public Task tokenTask(@PathVariable String token) throws TaskListException {
    TaskToken taskToken = taskListService.retrieveToken(token);

    return taskListService.getTask(taskToken.getTaskId());
  }

  @IsAuthenticated
  @PostMapping("/search")
  public List<Task> searchTasks(@RequestBody TaskSearch taskSearch) throws TaskListException {
    return taskListService.getTasks(taskSearch);
  }

  @IsAuthenticated
  @GetMapping("/{taskId}/claim")
  public Task claimTask(@PathVariable String taskId) throws TaskListException {
    String username = SecurityUtils.getConnectedUser().getUsername();
    return taskListService.claim(taskId, username);
  }

  @IsAuthenticated
  @GetMapping("/{taskId}/unclaim")
  public Task unclaimTask(@PathVariable String taskId) throws TaskListException {
    return taskListService.unclaim(taskId);
  }

  @IsAuthenticated
  @PostMapping("/{taskId}")
  public void completeTask(@PathVariable String taskId, @RequestBody Map<String, Object> variables)
      throws TaskListException {

    LOG.info("Completing task " + taskId + "` with variables: " + variables);
    taskListService.completeTask(taskId, variables);
  }

  @IsAuthenticated
  @PostMapping("/withJobKey/{jobKey}")
  public void completeTaskWithJobKey(
      @PathVariable Long jobKey, @RequestBody Map<String, Object> variables)
      throws TaskListException {

    LOG.info("Completing task by job key " + jobKey + "` with variables: " + variables);
    taskListService.completeTaskWithJobKey(jobKey, variables);
  }
}
