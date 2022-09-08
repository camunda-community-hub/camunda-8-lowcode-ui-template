package org.example.camunda.process.solution;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.example.camunda.process.solution.utils.BpmnUtils;
import org.junit.jupiter.api.Test;

public class BpmnUtilsTest {

  @Test
  public void testGetTaskNameFromBpmn() {
    String taskName = BpmnUtils.getTaskNameFromBpmn("simple-screenflow.bpmn", "Activity_1vqalfh");
    assertEquals("First Name", taskName);
  }

  @Test
  public void testGetFormSchemaFromBpmnFile() {
    String schema =
        BpmnUtils.getFormSchemaFromBpmnFile("simple-screenflow.bpmn", "userTaskForm_userTask1");
    assertNotNull(schema);
  }

  @Test
  public void testGetProcessName() {
    String processName = BpmnUtils.getProcessName("simple-screenflow.bpmn", "simple-screenflow");
    assertEquals("simple-screenflow", processName);
  }
}
