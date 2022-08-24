package org.example.camunda.process.solution;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.camunda.tasklist.dto.TaskState;
import io.camunda.tasklist.exception.TaskListException;
import io.camunda.zeebe.client.ZeebeClient;
import java.io.IOException;
import java.util.List;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import org.example.camunda.process.solution.facade.dto.Task;
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
  public void testGetTasks() throws TaskListException {
    List<Task> tasks = taskListService.getTasks(TaskState.CREATED, 10);
    assertTrue(tasks.size() > 0);
  }

  @Test
  public void testGetTaskNameFromBpmn()
      throws TaskListException, XPathExpressionException, IOException, ParserConfigurationException,
          SAXException {
    String taskName =
        taskListService.getTaskNameFromBpmn("Process_screenFlow1.bpmn", "Activity_1vqalfh");
    assertEquals("First Name", taskName);
  }
}
