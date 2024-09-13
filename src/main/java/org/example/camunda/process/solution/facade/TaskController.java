package org.example.camunda.process.solution.facade;

import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.facade.dto.TaskSearch;
import org.example.camunda.process.solution.jsonmodel.TasklistConf;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
import org.example.camunda.process.solution.service.TaskListService;
import org.example.camunda.process.solution.service.TasklistConfigurationService;
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
public class TaskController extends AbstractController {

  private static final Logger LOG = LoggerFactory.getLogger(TaskController.class);

  @Autowired private TaskListService taskListService;
  @Autowired private TasklistConfigurationService tasklistConfigurationService;

  @IsAuthenticated
  @PostMapping("/search")
  public List<Task> searchTasks(@RequestBody TaskSearch taskSearch) throws TaskListException {
    try {
      TasklistConf conf = tasklistConfigurationService.get();
      List<String> fetchVariables = new ArrayList<>();
      for (Map<String, Object> column : conf.getColumns()) {
        if (column.containsKey("variable") && (Boolean) column.get("variable")) {
          fetchVariables.add((String) column.get("value"));
        }
      }
      return taskListService.getTasks(taskSearch, fetchVariables);
    } catch (IOException e) {
      return taskListService.getTasks(taskSearch);
    }
  }

  @IsAuthenticated
  @GetMapping("/{taskId}/variables")
  public Map<String, Object> getVariables(@PathVariable String taskId) throws TaskListException {
    return taskListService.getVariables(taskId);
  }

  @IsAuthenticated
  @GetMapping("/{taskId}/claim")
  public Task claimTask(@PathVariable String taskId) throws TaskListException {
    String username = getAuthenticatedUsername();
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
    // TODO : find a more elegant solution for the comments
    variables.remove(ProcessController.COMMENTS_KEY);
    taskListService.completeTask(taskId, variables);
  }

  @Override
  public Logger getLogger() {
    return LOG;
  }
}
