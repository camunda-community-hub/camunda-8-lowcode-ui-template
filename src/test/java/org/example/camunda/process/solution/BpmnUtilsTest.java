package org.example.camunda.process.solution;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.File;
import java.io.IOException;
import org.apache.commons.io.FileUtils;
import org.example.camunda.process.solution.utils.BpmnUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class BpmnUtilsTest {

  private String XML;

  private BpmnUtils bpmnUtils;

  /**
   * @throws IOException
   */
  @BeforeEach
  public void setup() throws IOException {
    ClassLoader classLoader = getClass().getClassLoader();
    File file = new File(classLoader.getResource("models/simple-screenflow.bpmn").getFile());
    XML = FileUtils.readFileToString(file, "UTF-8");

    bpmnUtils = new BpmnUtils();
  }

  @Test
  public void testGetTaskNameFromBpmn() {
    String taskName = bpmnUtils.getTaskNameFromBpmn(XML, "Activity_1vqalfh");
    assertEquals("First Name", taskName);
  }

  @Test
  public void testGetFormSchemaFromBpmnFile() {
    String schema = bpmnUtils.getFormSchemaFromBpmnFile(XML, "userTaskForm_userTask1");
    assertNotNull(schema);
  }

  @Test
  public void testGetProcessName() {
    String processName = bpmnUtils.getProcessName(XML, "simple-screenflow");
    assertEquals("simple-screenflow", processName);
  }
}
