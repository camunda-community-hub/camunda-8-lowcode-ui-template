package org.example.camunda.process.solution;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.File;
import java.io.IOException;
import org.apache.commons.io.FileUtils;
import org.example.camunda.process.solution.utils.BpmnUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class BpmnUtilsTest {

  private String XML;

  /**
   * @throws IOException
   */
  @BeforeEach
  public void setup() throws IOException {
    ClassLoader classLoader = getClass().getClassLoader();
    File file = new File(classLoader.getResource("models/camunda-process.bpmn").getFile());
    XML = FileUtils.readFileToString(file, "UTF-8");
  }

  @Test
  public void testGetTaskNameFromBpmn() {
    String taskName = BpmnUtils.getTaskNameFromBpmn(XML, "task1");
    assertEquals("Task with extended FormJs", taskName);
  }

  @Test
  public void testGetProcessName() {
    String processName = BpmnUtils.getProcessName(XML, "camunda-process");
    assertEquals("camunda-process", processName);
  }
}
