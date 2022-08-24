package org.example.camunda.process.solution.facade.dto;

import io.camunda.tasklist.dto.TaskState;
import java.util.List;
import java.util.Map;

public class Task {
  private String id;

  private String name;

  private String processName;

  private String assignee;

  private String creationTime;

  private TaskState taskState;

  private List<String> candidateGroups;

  private List<String> sortValues;

  private Boolean isFirst;

  private Map<String, Object> variables;

  private String formKey;

  private String formSchema;

  private String processDefinitionId;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getProcessName() {
    return processName;
  }

  public void setProcessName(String processName) {
    this.processName = processName;
  }

  public String getAssignee() {
    return assignee;
  }

  public void setAssignee(String assignee) {
    this.assignee = assignee;
  }

  public String getCreationTime() {
    return creationTime;
  }

  public void setCreationTime(String creationTime) {
    this.creationTime = creationTime;
  }

  public TaskState getTaskState() {
    return taskState;
  }

  public void setTaskState(TaskState taskState) {
    this.taskState = taskState;
  }

  public List<String> getSortValues() {
    return sortValues;
  }

  public void setSortValues(List<String> sortValues) {
    this.sortValues = sortValues;
  }

  public Boolean getIsFirst() {
    return isFirst;
  }

  public void setIsFirst(Boolean isFirst) {
    this.isFirst = isFirst;
  }

  public Map<String, Object> getVariables() {
    return variables;
  }

  public void setVariables(Map<String, Object> variables) {
    this.variables = variables;
  }

  public List<String> getCandidateGroups() {
    return candidateGroups;
  }

  public void setCandidateGroups(List<String> candidateGroups) {
    this.candidateGroups = candidateGroups;
  }

  public String getFormKey() {
    return formKey;
  }

  public void setFormKey(String formKey) {
    this.formKey = formKey;
  }

  public String getProcessDefinitionId() {
    return processDefinitionId;
  }

  public void setProcessDefinitionId(String processDefinitionId) {
    this.processDefinitionId = processDefinitionId;
  }

  public String getFormSchema() {
    return formSchema;
  }

  public void setFormSchema(String formSchema) {
    this.formSchema = formSchema;
  }
}
