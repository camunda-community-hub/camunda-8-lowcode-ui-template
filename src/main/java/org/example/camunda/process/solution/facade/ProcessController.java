package org.example.camunda.process.solution.facade;

import java.util.List;
import java.util.Map;

import org.example.camunda.process.solution.ProcessConstants;
import org.example.camunda.process.solution.ProcessVariables;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.service.TaskListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.camunda.tasklist.dto.TaskState;
import io.camunda.tasklist.exception.TaskListException;
import io.camunda.zeebe.client.ZeebeClient;


@RestController
@RequestMapping("/process")
public class ProcessController {

    private final static Logger LOG = LoggerFactory.getLogger(ProcessController.class);

    @Autowired
    private ZeebeClient zeebe;
    
    @Autowired
    private TaskListService taskListService;

    @PostMapping("/start")
    public void startProcessInstance(@RequestBody ProcessVariables variables) {

        LOG.info("Starting process `" + ProcessConstants.BPMN_PROCESS_ID + "` with variables: " + variables);

        zeebe.newCreateInstanceCommand()
            .bpmnProcessId(ProcessConstants.BPMN_PROCESS_ID)
            .latestVersion()
            .variables(variables)
            .send();

    }

    @GetMapping("/tasks")
    public List<Task> getTasks() throws TaskListException {
        return taskListService.getTasks(null ,null);
    }

    @GetMapping("/tasks/unassigned")
    public List<Task> getUnassignedTasks() throws TaskListException {
        return taskListService.getTasks(TaskState.CREATED ,null);
    }

    @GetMapping("/tasks/myArchivedTasks/{userId}")
    public List<Task> getCompletedTasks(@PathVariable String userId) throws TaskListException {
        return taskListService.getAssigneeTasks(userId, TaskState.COMPLETED, null);
    }

    @GetMapping("/tasks/myOpenedTasks/{userId}")
    public List<Task> getOpenedTasks(@PathVariable String userId) throws TaskListException {
        return taskListService.getAssigneeTasks(userId, TaskState.CREATED, null);
    }

    @GetMapping("/tasks/groupTasks/{group}")
    public List<Task> getGroupTasks(@PathVariable String group) throws TaskListException {
        return taskListService.getGroupTasks(group, TaskState.CREATED, null);
    }

    @GetMapping("/tasks/{taskId}/claim/{userId}")
    public Task claimTask(@PathVariable String taskId, @PathVariable String userId) throws TaskListException {
        return taskListService.claim(taskId, userId);
    }
    @GetMapping("/tasks/{taskId}/unclaim")
    public Task claimTask(@PathVariable String taskId) throws TaskListException {
        return taskListService.unclaim(taskId);
    }
    
    @PostMapping("/tasks/{taskId}")
    public void completeTask(@PathVariable String taskId, @RequestBody Map<String, Object> variables)
            throws TaskListException {

        LOG.info("Completing task " + taskId + "` with variables: " + variables);

        taskListService.completeTask(taskId, variables);
    }

}