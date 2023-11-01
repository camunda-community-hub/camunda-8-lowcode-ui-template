package org.example.camunda.process.solution.facade.dto;

import java.util.List;

public class TaskSearch {

  private Boolean assigned;

  private String state;

  private String assignee;

  private Integer pageSize;

  private List<String> search;

  private String direction;

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

  public List<String> getSearch() {
    return search;
  }

  public void setSearch(List<String> search) {
    this.search = search;
  }

  public String getDirection() {
    return direction;
  }

  public void setDirection(String direction) {
    this.direction = direction;
  }
}
