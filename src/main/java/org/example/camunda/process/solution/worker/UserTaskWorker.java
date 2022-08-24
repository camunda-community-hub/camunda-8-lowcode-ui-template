package org.example.camunda.process.solution.worker;

import io.camunda.tasklist.dto.TaskState;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.client.api.worker.JobClient;
import io.camunda.zeebe.spring.client.annotation.ZeebeCustomHeaders;
import io.camunda.zeebe.spring.client.annotation.ZeebeVariablesAsType;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Form;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.service.FormService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserTaskWorker {

  private static final Logger LOG = LoggerFactory.getLogger(UserTaskWorker.class);

  @Autowired private FormService formService;

  @Autowired SimpMessagingTemplate simpMessagingTemplate;

  @ZeebeWorker(type = "io.camunda.zeebe:userTask", timeout = 2592000000L) // set timeout to 30 days
  public void completeUserTask(
      final JobClient client,
      final ActivatedJob job,
      @ZeebeVariablesAsType Map<String, Object> variables,
      @ZeebeCustomHeaders Map<String, String> headers) {

    try {

      LOG.info("User Task Worker triggered with variables: " + variables);

      Task task = new Task();
      Form form = new Form();

      // TODO: need task id
      // String taskId = null;
      // task.setId();

      // TODO: need task name
      // String taskName = null;
      // task.setName();

      // TODO: need creation time
      // String creationTime = null;

      String processId = job.getBpmnProcessId();
      task.setProcessDefinitionId(Long.toString(job.getProcessDefinitionKey()));

      // TODO: need process name
      // String processName = null;
      // task.setProcessName();

      // TODO: is instance key the same as task id ??
      String processInstanceKey = Long.toString(job.getProcessInstanceKey());
      task.setId(processInstanceKey);

      long jobKey = job.getKey();

      String formKey = headers.get("io.camunda.zeebe:formKey");
      task.setFormKey(formKey);

      String formId = formService.parseFormIdFromKey(formKey);
      String schema = formService.getFormSchemaFromBpmn("simple-screenflow.bpmn", formId);
      task.setFormSchema(schema);

      String assignee = headers.get("io.camunda.zeebe:assignee");
      task.setAssignee(assignee);

      // TODO: set candidate groups
      List<String> candidateGroups = null; // TODO: are candidate groups passed as header?
      // task.setCandidateGroups();

      TaskState taskState = TaskState.CREATED;
      task.setTaskState(taskState);

      List<String> sortValues = null; // what is this used for?
      Boolean isFirst = true; // TODO: what is this used for?

      simpMessagingTemplate.convertAndSend("/topic/" + assignee + "/userTask", task);

    } catch (Exception e) {
      client.newFailCommand(job.getKey()).retries(0).send();
    }
  }
}
