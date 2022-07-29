package org.example.camunda.process.solution;

import static io.camunda.zeebe.process.test.assertions.BpmnAssert.assertThat;
import static io.camunda.zeebe.spring.test.ZeebeTestThreadSupport.waitForProcessInstanceCompleted;
import static io.camunda.zeebe.spring.test.ZeebeTestThreadSupport.waitForProcessInstanceHasPassedElement;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ProcessInstanceEvent;
import io.camunda.zeebe.process.test.api.ZeebeTestEngine;
import io.camunda.zeebe.spring.test.ZeebeSpringTest;
import java.time.Duration;
import org.example.camunda.process.solution.service.MyService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

/**
 * @see
 *     https://docs.camunda.io/docs/components/best-practices/development/testing-process-definitions/#writing-process-tests-in-java
 */
@SpringBootTest(classes = ProcessApplication.class) // will deploy BPMN & DMN models
@ZeebeSpringTest
public class ProcessUnitTest {

  @Autowired private ZeebeClient zeebe;

  @Autowired private ZeebeTestEngine engine;

  @MockBean private MyService myService;

  @Test
  public void testHappyPath() throws Exception {
    // define mock behavior
    when(myService.myOperation(anyString())).thenReturn(true);

    // prepare data
    final ProcessVariables variables = new ProcessVariables().setTexte("23");

    // start a process instance
    ProcessInstanceEvent processInstance =
        zeebe
            .newCreateInstanceCommand()
            .bpmnProcessId(ProcessConstants.BPMN_PROCESS_ID)
            .latestVersion()
            .variables(variables)
            .send()
            .join();

    // wait for process to be started
    engine.waitForIdleState(Duration.ofSeconds(1));
    assertThat(processInstance).isStarted();

    // check that service task has been completed
    waitForProcessInstanceHasPassedElement(processInstance, "Task_InvokeService");
    Mockito.verify(myService).myOperation("23");

    // check that process is ended with the right result
    waitForProcessInstanceCompleted(processInstance);
    assertThat(processInstance)
        .isCompleted()
        .hasPassedElement("Task_InvokeService")
        .hasVariableWithValue("result", true);

    // ensure no other side effects
    Mockito.verifyNoMoreInteractions(myService);
  }
}
