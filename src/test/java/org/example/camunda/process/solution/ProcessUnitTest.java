package org.example.camunda.process.solution;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.camunda.tasklist.exception.TaskListException;
import io.camunda.zeebe.client.ZeebeClient;
import java.io.IOException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import org.example.camunda.process.solution.service.TaskListService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.xml.sax.SAXException;

@SpringBootTest(classes = ProcessApplication.class) // will deploy BPMN & DMN models
public class ProcessUnitTest {

  @Autowired private ZeebeClient zeebe;
  @Autowired private TaskListService taskListService;

  @Test
  public void testGetTaskNameFromBpmn()
      throws TaskListException, XPathExpressionException, IOException, ParserConfigurationException,
          SAXException {
    String taskName =
        taskListService.getTaskNameFromBpmn("simple-screenflow.bpmn", "Activity_1vqalfh");
    assertEquals("First Name", taskName);
  }
}
