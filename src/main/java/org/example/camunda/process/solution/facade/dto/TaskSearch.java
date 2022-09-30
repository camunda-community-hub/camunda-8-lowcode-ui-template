package org.example.camunda.process.solution.facade.dto;

public class TaskSearch {

  private Boolean assigned;

  private String state;

  private String assignee;

  private Integer pageSize;

  private String group;

  public String getState() {
    return state;
  }

  public void setState(String state) {
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

  public Boolean getAssigned() {
    return assigned;
  }

  public void setAssigned(Boolean assigned) {
    this.assigned = assigned;
  }
}
