package org.example.camunda.process.solution.worker;

import io.camunda.tasklist.dto.TaskState;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.client.api.worker.JobClient;
import io.camunda.zeebe.spring.client.annotation.ZeebeCustomHeaders;
import io.camunda.zeebe.spring.client.annotation.ZeebeVariablesAsType;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.service.FormService;
import org.example.camunda.process.solution.service.TaskListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserTaskWorker {

  private static final Logger LOG = LoggerFactory.getLogger(UserTaskWorker.class);

  @Autowired private FormService formService;

  @Autowired private SimpMessagingTemplate simpMessagingTemplate;

  @Autowired private TaskListService taskListService;

  @ZeebeWorker(type = "io.camunda.zeebe:userTask", timeout = 2592000000L) // set timeout to 30 days
  public void completeUserTask(
      final JobClient client,
      final ActivatedJob job,
      @ZeebeVariablesAsType Map<String, Object> variables,
      @ZeebeCustomHeaders Map<String, String> headers) {

    try {

      LOG.info("User Task Worker triggered with variables: " + variables);

      Task task = new Task();

      task.setVariables(variables);

      String processDefinitionKey = Long.toString(job.getProcessDefinitionKey());
      task.setProcessDefinitionId(processDefinitionKey);

      String formKey = headers.get("io.camunda.zeebe:formKey");
      task.setFormKey(formKey);

      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss Z");
      String creationTime = sdf.format(new Date());
      task.setCreationTime(creationTime);

      // Note: Job Key != Task Id :-(
      String jobKey = Long.toString(job.getKey());
      // task.setId(jobKey);

      // But good news, job.getElementInstanceKey() is the "taskId" that is expected by task list graphql
      String taskId = Long.toString(job.getElementInstanceKey());
      task.setId(taskId);

      String bpmnProcessId = job.getBpmnProcessId();
      task.setProcessName(bpmnProcessId);

      String taskActivityId = job.getElementId();
      // !!! The name of the bpmn file in the "src/main/resources/models" directory must match the
      // process id in order for this to work!
      String taskName =
          taskListService.getTaskNameFromBpmn(bpmnProcessId + ".bpmn", taskActivityId);
      task.setName(taskName);

      String formId = formService.parseFormIdFromKey(formKey);
      String schema = formService.getFormSchemaFromBpmn(bpmnProcessId + ".bpmn", formId);
      task.setFormSchema(schema);

      String assignee = headers.get("io.camunda.zeebe:assignee");
      task.setAssignee(assignee);

      TaskState taskState = TaskState.CREATED;
      task.setTaskState(taskState);

      // Do we need processInstanceKey ?
      // String processInstanceKey = Long.toString(job.getProcessInstanceKey());

      // TODO: implement candidate groups
      // I'm not sure this is the correct header?
      // String candidateGroups = headers.get("io.camunda.zeebe:candidateGroups");
      // Need to convert comma delimited string to a list
      // task.setCandidateGroups(candidateGroups);

      // Do we need sort Values? What is it used for?
      // List<String> sortValues = null; // what is this used for?

      // Do we need isFirst? What is it used for?
      // Boolean isFirst = true;

      simpMessagingTemplate.convertAndSend("/topic/" + assignee + "/userTask", task);

    } catch (Exception e) {
      client.newFailCommand(job.getKey()).retries(0).send();
    }
  }
}
