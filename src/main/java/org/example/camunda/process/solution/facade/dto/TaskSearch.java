package org.example.camunda.process.solution.facade.dto;

import io.camunda.tasklist.dto.TaskState;

public class TaskSearch {
  private TaskState state;

  private String assignee;

  private Integer pageSize;

  private String group;

  public TaskState getState() {
    return state;
  }

  public void setState(TaskState state) {
    this.state = state;
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

  public void setPageSize(Integer pageSize) {
    this.pageSize = pageSize;
  }

  public String getGroup() {
    return group;
  }

  public void setGroup(String group) {
    this.group = group;
  }
}
