package org.example.camunda.process.solution;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.example.camunda.process.solution.utils.BpmnUtils;
import org.junit.jupiter.api.Test;

public class BpmnUtilsTest {

  @Test
  public void testGetTaskNameFromBpmn() {
    String taskName = BpmnUtils.getTaskNameFromBpmn("camunda-process.bpmn", "task1");
    assertEquals("Task One", taskName);
  }

  @Test
  public void testGetFormSchemaFromBpmnFile() {
    String schema =
        BpmnUtils.getFormSchemaFromBpmnFile("camunda-process.bpmn", "userTaskForm_3cosl6j");
    assertNotNull(schema);
  }

  @Test
  public void testGetProcessName() {
    String processName = BpmnUtils.getProcessName("camunda-process.bpmn", "camunda-process");
    assertEquals("camunda-process", processName);
  }
}
