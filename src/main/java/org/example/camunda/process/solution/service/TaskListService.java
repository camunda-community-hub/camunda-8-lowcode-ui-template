package org.example.camunda.process.solution.service;

import io.camunda.tasklist.rest.TaskListRestClient;
import io.camunda.tasklist.rest.dto.requests.TaskAssignRequest;
import io.camunda.tasklist.rest.dto.requests.TaskSearchRequest;
import io.camunda.tasklist.rest.dto.responses.TaskResponse;
import io.camunda.tasklist.rest.dto.responses.TaskSearchResponse;
import io.camunda.tasklist.rest.exception.TaskListException;
import io.camunda.tasklist.rest.exception.TaskListRestException;
import io.camunda.zeebe.client.ZeebeClient;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.example.camunda.process.solution.dao.TaskTokenRepository;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.facade.dto.TaskSearch;
import org.example.camunda.process.solution.model.TaskToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TaskListService {

  @Value("baseUrl")
  String baseUrl;

  @Autowired private TaskListRestClient taskListRestClient;

  @Autowired private ZeebeClient zeebeClient;

  @Autowired private TaskTokenRepository taskTokenRepository;

  public Task claim(String taskId, String assignee)
      throws TaskListRestException, TaskListException {
    TaskAssignRequest taskAssignRequest = new TaskAssignRequest();
    taskAssignRequest.setAssignee(assignee);
    return convert(taskListRestClient.assignTask(taskId, taskAssignRequest));
  }

  public Task unclaim(String taskId) throws TaskListException, TaskListRestException {
    return convert(taskListRestClient.unassignTask(taskId));
  }

  public Task getTask(String taskId) throws TaskListException, TaskListRestException {
    return convert(taskListRestClient.getTask(taskId));
  }

  // TODO: implement pagination
  public List<Task> getTasks(TaskSearch taskSearch)
      throws TaskListException, TaskListRestException {
    TaskSearchRequest taskSearchRequest = new TaskSearchRequest();

    taskSearchRequest.setState(taskSearch.getState());

    List<String> sortBy = new ArrayList<>();
    sortBy.add(taskSearch.getDirection());
    taskSearchRequest.setSort(sortBy);

    taskSearchRequest.setAssigned(taskSearch.getAssigned());
    taskSearchRequest.setAssignee(taskSearch.getAssignee());
    taskSearchRequest.setCandidateGroup(taskSearch.getGroup());

    return convert(taskListRestClient.searchTasks(taskSearchRequest));
  }

  public List<Task> getTasks(String state, Integer pageSize)
      throws TaskListException, TaskListRestException {
    TaskSearch taskSearch = new TaskSearch();
    taskSearch.setPageSize(pageSize);
    taskSearch.setState(state);
    return getTasks(taskSearch);
  }

  // TODO: implement pageSize
  public List<Task> getGroupTasks(String group, String state, Integer pageSize)
      throws TaskListException, TaskListRestException {
    TaskSearch taskSearch = new TaskSearch();
    taskSearch.setPageSize(pageSize);
    taskSearch.setState(state);
    taskSearch.setGroup(group);
    return getTasks(taskSearch);
  }

  public List<Task> getAssigneeTasks(String assignee, String state, Integer pageSize)
      throws TaskListException, TaskListRestException {
    TaskSearch taskSearch = new TaskSearch();
    taskSearch.setPageSize(pageSize);
    taskSearch.setAssignee(assignee);
    taskSearch.setState(state);
    return getTasks(taskSearch);
  }

  public void completeTask(String taskId, Map<String, Object> variables)
      throws TaskListException, TaskListRestException {
    taskListRestClient.completeTask(taskId, variables);
  }

  public void completeTaskWithJobKey(Long jobKey, Map<String, Object> variables) {
    zeebeClient.newCompleteCommand(jobKey).variables(variables).send();
  }

  public String getForm(String processDefinitionId, String formId) throws TaskListException {
    throw new IllegalStateException("Not implemented");
  }

  private Task convert(TaskResponse response) {
    return new Task();
  }

  private List<Task> convert(List<TaskSearchResponse> responses) {
    List results = new ArrayList();
    results.add(new Task());
    return results;
  }

  /*private Task convert(TaskResponse taskResponse) {
    Task result = new Task();
    BeanUtils.copyProperties(taskResponse, result);
    if (taskResponse.get.getVariables() != null) {
      result.setVariables(new HashMap<>());
      for (Variable var : task.getVariables()) {
        result.getVariables().put(var.getName(), var.getValue());
      }
    }
    return result;
  }

  private List<Task> convert(TaskList tasks) {
    List<Task> result = new ArrayList<>();
    for (io.camunda.tasklist.dto.Task task : tasks) {
      result.add(convert(task));
    }
    return result;
  }*/

  public String generateLink(String taskId) {
    String token = generateTaskToken(taskId);
    return baseUrl + "/direct-task.html?token=" + token;
  }

  public String generateTaskToken(String taskId) {
    String token = UUID.randomUUID().toString();
    TaskToken taskToken = new TaskToken();
    taskToken.setTaskId(taskId);
    taskToken.setToken(token);
    taskTokenRepository.save(taskToken);
    return token;
  }

  public TaskToken retrieveToken(String token) {
    return taskTokenRepository.findByToken(token);
  }
}
