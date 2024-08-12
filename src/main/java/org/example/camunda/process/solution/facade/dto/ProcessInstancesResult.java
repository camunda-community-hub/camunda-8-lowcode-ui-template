package org.example.camunda.process.solution.facade.dto;

import io.camunda.operate.model.ProcessInstance;
import io.camunda.operate.model.SearchResult;
import java.util.List;
import java.util.Map;

public class ProcessInstancesResult {
  private List<ProcessInstance> items;

  private Map<Long, Map<String, Object>> variables;

  private Integer total;

  private List<Object> sortValues;

  public ProcessInstancesResult() {}

  public ProcessInstancesResult(
      SearchResult<ProcessInstance> result, Map<Long, Map<String, Object>> variables) {
    this.items = result.getItems();
    this.total = result.getTotal();
    this.sortValues = result.getSortValues();
    this.variables = variables;
  }

  public List<ProcessInstance> getItems() {
    return items;
  }

  public void setItems(List<ProcessInstance> items) {
    this.items = items;
  }

  public Map<Long, Map<String, Object>> getVariables() {
    return variables;
  }

  public void setVariables(Map<Long, Map<String, Object>> variables) {
    this.variables = variables;
  }

  public Integer getTotal() {
    return total;
  }

  public void setTotal(Integer total) {
    this.total = total;
  }

  public List<Object> getSortValues() {
    return sortValues;
  }

  public void setSortValues(List<Object> sortValues) {
    this.sortValues = sortValues;
  }
}
