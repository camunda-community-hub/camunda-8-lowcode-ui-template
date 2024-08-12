package org.example.camunda.process.solution.jsonmodel;

import java.util.List;
import java.util.Map;

public class TasklistConf {

  private Boolean displayIntancesPage;
  private String instancesBpmnProcessId;
  private List<Map<String, Object>> instancesColumns;
  private Boolean splitPage;
  private Boolean filterOnAssignee;
  private String formatDate;
  private String formatDatetime;
  private List<Map<String, Object>> columns;
  private Map<String, Boolean> defaultFilters;
  private List<Map<String, Object>> variablesFilters;

  public Boolean getDisplayIntancesPage() {
    return displayIntancesPage;
  }

  public void setDisplayIntancesPage(Boolean displayIntancesPage) {
    this.displayIntancesPage = displayIntancesPage;
  }

  public String getInstancesBpmnProcessId() {
    return instancesBpmnProcessId;
  }

  public void setInstancesBpmnProcessId(String instancesBpmnProcessId) {
    this.instancesBpmnProcessId = instancesBpmnProcessId;
  }

  public List<Map<String, Object>> getInstancesColumns() {
    return instancesColumns;
  }

  public void setInstancesColumns(List<Map<String, Object>> instancesColumns) {
    this.instancesColumns = instancesColumns;
  }

  public Boolean getFilterOnAssignee() {
    return filterOnAssignee;
  }

  public void setFilterOnAssignee(Boolean filterOnAssignee) {
    this.filterOnAssignee = filterOnAssignee;
  }

  public List<Map<String, Object>> getColumns() {
    return columns;
  }

  public void setColumns(List<Map<String, Object>> columns) {
    this.columns = columns;
  }

  public Map<String, Boolean> getDefaultFilters() {
    return defaultFilters;
  }

  public void setDefaultFilters(Map<String, Boolean> defaultFilters) {
    this.defaultFilters = defaultFilters;
  }

  public List<Map<String, Object>> getVariablesFilters() {
    return variablesFilters;
  }

  public void setVariablesFilters(List<Map<String, Object>> variablesFilters) {
    this.variablesFilters = variablesFilters;
  }

  public Boolean getSplitPage() {
    return splitPage;
  }

  public void setSplitPage(Boolean splitPage) {
    this.splitPage = splitPage;
  }

  public String getFormatDate() {
    return formatDate;
  }

  public void setFormatDate(String formatDate) {
    this.formatDate = formatDate;
  }

  public String getFormatDatetime() {
    return formatDatetime;
  }

  public void setFormatDatetime(String formatDatetime) {
    this.formatDatetime = formatDatetime;
  }
}
