package org.example.camunda.process.solution.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.example.camunda.process.solution.facade.dto.Task;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.camunda.tasklist.CamundaTaskListClient;
import io.camunda.tasklist.auth.SaasAuthentication;
import io.camunda.tasklist.dto.Form;
import io.camunda.tasklist.dto.TaskState;
import io.camunda.tasklist.dto.Variable;
import io.camunda.tasklist.exception.TaskListException;

@Service
public class TaskListService {
    
    @Value("${zeebe.client.cloud.client-id}")
    private String clientId;

    @Value("${zeebe.client.cloud.client-secret}")
    private String clientSecret;

    @Value("${zeebe.client.cloud.clusterId}")
    private String clusterId;
    
    @Value("${zeebe.client.cloud.region}")
    private String region;

    private  CamundaTaskListClient client;
    
    private CamundaTaskListClient getCamundaTaskListClient() throws TaskListException {
        if (client==null) {
            SaasAuthentication sa = new SaasAuthentication(clientId, clientSecret);
            client = new CamundaTaskListClient.Builder().shouldReturnVariables().taskListUrl("https://"+region+".tasklist.camunda.io/"+clusterId).authentication(sa).build();
        }
        return client;
    }
    
    public Task claim(String taskId, String assignee) throws TaskListException {
        return convert(getCamundaTaskListClient().claim(taskId, assignee));
    }
    public Task unclaim(String taskId) throws TaskListException {
        return convert(getCamundaTaskListClient().unclaim(taskId));
    }

    public List<Task> getGroupTasks(String group, TaskState state, Integer pageSize) throws TaskListException {
        return convert(getCamundaTaskListClient().getGroupTasks(group, state, pageSize));
    }

    public List<Task> getAssigneeTasks(String assignee, TaskState state, Integer pageSize) throws TaskListException {
        return convert(getCamundaTaskListClient().getAssigneeTasks(assignee, state, pageSize));
    }
    
    public List<Task> getTasks(TaskState state, Integer pageSize) throws TaskListException {
        return convert(getCamundaTaskListClient().getTasks(null, state, pageSize));
    }

    public void completeTask(String taskId, Map<String, Object> variables) throws TaskListException {
        getCamundaTaskListClient().completeTask(taskId, variables);
    }

    public String getForm(String processDefinitionId, String formId) throws TaskListException {
        Form form = getCamundaTaskListClient().getForm(formId, processDefinitionId);
        return form.getSchema();
    }

    private Task convert(io.camunda.tasklist.dto.Task task) {
        Task result = new Task();
        BeanUtils.copyProperties(task,result);
        if (task.getVariables()!=null) {
            result.setVariables(new HashMap<>());
            for(Variable var : task.getVariables()) {
                result.getVariables().put(var.getName(), var.getValue());
            }
        }
        return result;
    }
    
    private List<Task> convert(List<io.camunda.tasklist.dto.Task> tasks) {
        List<Task> result = new ArrayList<>();
        for(io.camunda.tasklist.dto.Task task : tasks) {
            result.add(convert(task));
        }
        return result;
    }
}
