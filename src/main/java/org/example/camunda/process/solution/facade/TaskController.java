package org.example.camunda.process.solution.facade;

import io.camunda.tasklist.dto.TaskState;
import io.camunda.tasklist.exception.TaskListException;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.model.TaskToken;
import org.example.camunda.process.solution.service.TaskListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/tasks")
public class TaskController {

  private static final Logger LOG = LoggerFactory.getLogger(TaskController.class);

  @Autowired private TaskListService taskListService;

  @GetMapping()
  public List<Task> getTasks() throws TaskListException {
    return taskListService.getTasks(null, null);
  }

  @GetMapping("/token/{token}")
  public Task tokenTask(@PathVariable String token) throws TaskListException {
    TaskToken taskToken = taskListService.retrieveToken(token);

    return taskListService.getTask(taskToken.getTaskId());
  }

  @GetMapping("/unassigned")
  public List<Task> getUnassignedTasks() throws TaskListException {
    return taskListService.getTasks(TaskState.CREATED, null);
  }

  @GetMapping("/myArchivedTasks/{userId}")
  public List<Task> getCompletedTasks(@PathVariable String userId) throws TaskListException {
    return taskListService.getAssigneeTasks(userId, TaskState.COMPLETED, null);
  }

  @GetMapping("/myOpenedTasks/{userId}")
  public List<Task> getOpenedTasks(@PathVariable String userId) throws TaskListException {
    return taskListService.getAssigneeTasks(userId, TaskState.CREATED, null);
  }

  @GetMapping("/groupTasks/{group}")
  public List<Task> getGroupTasks(@PathVariable String group) throws TaskListException {
    return taskListService.getGroupTasks(group, TaskState.CREATED, null);
  }

  @GetMapping("/{taskId}/claim/{userId}")
  public Task claimTask(@PathVariable String taskId, @PathVariable String userId)
      throws TaskListException {
    return taskListService.claim(taskId, userId);
  }

  @GetMapping("/{taskId}/unclaim")
  public Task claimTask(@PathVariable String taskId) throws TaskListException {
    return taskListService.unclaim(taskId);
  }

  @PostMapping("/{taskId}")
  public void completeTask(@PathVariable String taskId, @RequestBody Map<String, Object> variables)
      throws TaskListException {

    LOG.info("Completing task " + taskId + "` with variables: " + variables);

    taskListService.completeTask(taskId, variables);
  }
}
