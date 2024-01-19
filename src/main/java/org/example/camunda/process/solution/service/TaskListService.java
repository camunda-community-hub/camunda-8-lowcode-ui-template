package org.example.camunda.process.solution.service;

import io.camunda.tasklist.CamundaTaskListClient;
import io.camunda.tasklist.dto.Form;
import io.camunda.tasklist.dto.Pagination;
import io.camunda.tasklist.dto.TaskList;
import io.camunda.tasklist.dto.TaskState;
import io.camunda.tasklist.dto.Variable;
import io.camunda.tasklist.exception.TaskListException;
import io.camunda.zeebe.client.ZeebeClient;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.facade.dto.TaskSearch;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TaskListService {

  @Value("${zeebe.client.cloud.clientId:notProvided}")
  private String clientId;

  @Value("${zeebe.client.cloud.clientSecret:notProvided}")
  private String clientSecret;

  @Value("${zeebe.client.cloud.clusterId:notProvided}")
  private String clusterId;

  @Value("${zeebe.client.cloud.region:notProvided}")
  private String region;

  @Value("${identity.clientId:notProvided}")
  private String identityClientId;

  @Value("${identity.clientSecret:notProvided}")
  private String identityClientSecret;

  @Value("${tasklistUrl:notProvided}")
  private String tasklistUrl;

  @Value("${keycloakUrl:notProvided}")
  private String keycloakUrl;

  private CamundaTaskListClient client;

  @Autowired private ZeebeClient zeebeClient;

  private CamundaTaskListClient getCamundaTaskListClient() throws TaskListException {
    if (client == null) {
      if (!"notProvided".equals(clientId)) {
        client =
            CamundaTaskListClient.builder()
                .shouldReturnVariables()
                .taskListUrl("https://" + region + ".tasklist.camunda.io/" + clusterId)
                .saaSAuthentication(clientId, clientSecret)
                .build();
      } else {

        client =
            CamundaTaskListClient.builder()
                .shouldReturnVariables()
                .taskListUrl(tasklistUrl)
                .selfManagedAuthentication(identityClientId, identityClientSecret, keycloakUrl)
                .build();
      }
    }
    return client;
  }

  public Task claim(String taskId, String assignee) throws TaskListException {
    return convert(getCamundaTaskListClient().claim(taskId, assignee));
  }

  public Task unclaim(String taskId) throws TaskListException {
    return convert(getCamundaTaskListClient().unclaim(taskId));
  }

  public Task getTask(String taskId) throws TaskListException {
    return convert(getCamundaTaskListClient().getTask(taskId));
  }

  public List<Task> getTasks(TaskSearch taskSearch) throws TaskListException {
    Pagination pagination =
        new Pagination()
            .setPageSize(taskSearch.getPageSize())
            .setSearch(taskSearch.getSearch())
            .setSearchType(taskSearch.getDirection());
    io.camunda.tasklist.dto.TaskSearch tasklistSearch = new io.camunda.tasklist.dto.TaskSearch();
    if (taskSearch.getFilterVariables() != null) {
      for (Map.Entry<String, Object> filter : taskSearch.getFilterVariables().entrySet()) {
        if (filter.getValue() instanceof String) {
          tasklistSearch.addVariableFilter(
              filter.getKey(), JsonUtils.eventuallyJsonNode((String) filter.getValue()));
        } else {
          tasklistSearch.addVariableFilter(filter.getKey(), filter.getValue());
        }
      }
    }

    tasklistSearch.setAssigned(taskSearch.getAssigned());

    tasklistSearch.setAssignee(taskSearch.getAssignee());
    tasklistSearch.setState(TaskState.fromJson(taskSearch.getState()));
    tasklistSearch.setGroup(taskSearch.getGroup());
    tasklistSearch.setPagination(pagination);

    return convert(getCamundaTaskListClient().getTasks(tasklistSearch));
  }

  public List<Task> getGroupTasks(String group, TaskState state, Integer pageSize)
      throws TaskListException {
    return convert(getCamundaTaskListClient().getGroupTasks(group, state, pageSize));
  }

  public List<Task> getAssigneeTasks(String assignee, TaskState state, Integer pageSize)
      throws TaskListException {
    return convert(getCamundaTaskListClient().getAssigneeTasks(assignee, state, pageSize));
  }

  public List<Task> getTasks(TaskState state, Integer pageSize) throws TaskListException {
    return convert(getCamundaTaskListClient().getTasks(null, state, pageSize));
  }

  public void completeTask(String taskId, Map<String, Object> variables) throws TaskListException {
    getCamundaTaskListClient().completeTask(taskId, variables);
  }

  public void completeTaskWithJobKey(Long jobKey, Map<String, Object> variables) {
    zeebeClient.newCompleteCommand(jobKey).variables(variables).send();
  }

  public String getForm(String processDefinitionId, String formId) throws TaskListException {
    Form form = getCamundaTaskListClient().getForm(formId, processDefinitionId);
    return form.getSchema();
  }

  private Task convert(io.camunda.tasklist.dto.Task task) {
    Task result = new Task();
    BeanUtils.copyProperties(task, result);
    if (task.getVariables() != null) {
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
  }
}
