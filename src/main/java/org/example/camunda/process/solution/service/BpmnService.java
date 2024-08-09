package org.example.camunda.process.solution.service;

import io.camunda.operate.exception.OperateException;
import io.camunda.tasklist.exception.TaskListException;
import org.example.camunda.process.solution.utils.BpmnUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BpmnService {

  @Autowired private OperateService operateService;

  public String getEmbeddedFormSchema(String processDefinitionId, String formId)
      throws TaskListException, NumberFormatException, OperateException {
    String xml = operateService.getProcessDefinitionXmlByKey(Long.valueOf(processDefinitionId));
    return BpmnUtils.getFormSchemaFromBpmn(xml, formId);
  }

  public String getTaskName(String processDefinitionId, String activityId)
      throws NumberFormatException, OperateException {
    String xml = operateService.getProcessDefinitionXmlByKey(Long.valueOf(processDefinitionId));
    return BpmnUtils.getTaskNameFromBpmn(xml, activityId);
  }

  public String getProcessName(String bpmnProcessId, String processDefinitionId)
      throws NumberFormatException, OperateException {
    String xml = operateService.getProcessDefinitionXmlByKey(Long.valueOf(processDefinitionId));
    return BpmnUtils.getTaskNameFromBpmn(xml, bpmnProcessId);
  }
}
