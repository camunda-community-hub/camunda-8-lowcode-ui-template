package org.example.camunda.process.solution.facade.dto;

import io.camunda.tasklist.dto.SearchType;
import java.util.List;
import java.util.Map;

public class TaskSearch {

  private Boolean assigned;

  private String state;

  private String assignee;

  private String group;

  private Map<String, Object> filterVariables;

  private Integer pageSize;

  private List<String> search;

  private SearchType direction;

  private String processDefinitionKey;

  private String taskDefinitionId;

  private Long processInstanceKey;

  public String getState() {
    return state;
  }

  public TaskSearch setState(String state) {
    this.state = state;
    return this;
  }

  public String getAssignee() {
    return assignee;
  }

  public void setAssignee(String assignee) {
    this.assignee = assignee;
  }

  public Integer getPageSize() {
    return pageSize;
  }

  public TaskSearch setPageSize(Integer pageSize) {
    this.pageSize = pageSize;
    return this;
  }

  public String getGroup() {
    return group;
  }

  public void setGroup(String group) {
    this.group = group;
  }

  public Boolean getAssigned() {
    return assigned;
  }

  public void setAssigned(Boolean assigned) {
    this.assigned = assigned;
  }

  public List<String> getSearch() {
    return search;
  }

  public void setSearch(List<String> search) {
    this.search = search;
  }

  public SearchType getDirection() {
    return direction;
  }

  public void setDirection(SearchType direction) {
    this.direction = direction;
  }

  public Map<String, Object> getFilterVariables() {
    return filterVariables;
  }

  public void setFilterVariables(Map<String, Object> filterVariables) {
    this.filterVariables = filterVariables;
  }

  public String getProcessDefinitionKey() {
    return processDefinitionKey;
  }

  public TaskSearch setProcessDefinitionKey(String processDefinitionKey) {
    this.processDefinitionKey = processDefinitionKey;
    return this;
  }

  public String getTaskDefinitionId() {
    return taskDefinitionId;
  }

  public TaskSearch setTaskDefinitionId(String taskDefinitionId) {
    this.taskDefinitionId = taskDefinitionId;
    return this;
  }

  public Long getProcessInstanceKey() {
    return processInstanceKey;
  }

  public TaskSearch setProcessInstanceKey(Long processInstanceId) {
    this.processInstanceKey = processInstanceId;
    return this;
  }
}
