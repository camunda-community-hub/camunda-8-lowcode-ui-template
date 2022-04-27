package org.example.camunda.process.solution;

import static io.camunda.zeebe.process.test.assertions.BpmnAssert.assertThat;
import static io.camunda.zeebe.spring.test.ZeebeTestThreadSupport.waitForProcessInstanceCompleted;
import static io.camunda.zeebe.spring.test.ZeebeTestThreadSupport.waitForProcessInstanceHasPassedElement;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.time.Duration;

import org.example.camunda.process.solution.service.MyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ProcessInstanceEvent;
import io.camunda.zeebe.process.test.api.ZeebeTestEngine;
import io.camunda.zeebe.spring.test.ZeebeSpringTest;

/**
 * @see https://docs.camunda.io/docs/components/best-practices/development/testing-process-definitions/#writing-process-tests-in-java
 */
@SpringBootTest(classes = ProcessApplication.class)
@ZeebeSpringTest
public class ProcessUnitTest {

    @Autowired
    private ZeebeClient client;

    @Autowired
    private ZeebeTestEngine engine;
    
    @MockBean
    private MyService myService;

    @Test
    public void testHappyPath() throws Exception {
        when(myService.myOperation(anyString()))
            .thenReturn(true);

        assertThat(
            client.newDeployResourceCommand()
            .addResourceFromClasspath("models/camunda-process.bpmn")
            .send()
            .join()
        );

        final ProcessVariables variables = new ProcessVariables();
        variables.setBusinessKey("23");

        ProcessInstanceEvent processInstance = client.newCreateInstanceCommand()
            .bpmnProcessId(ProcessConstants.BPMN_PROCESS_ID)
            .latestVersion()
            .variables(variables)
            .send()
            .join();

        engine.waitForIdleState(Duration.ofSeconds(1));

        assertThat(processInstance).isStarted();

        waitForProcessInstanceHasPassedElement(processInstance, "Task_InvokeService");

        waitForProcessInstanceCompleted(processInstance);

        assertThat(processInstance).isCompleted()
            .hasPassedElement("Task_InvokeService")
            .hasVariableWithValue("result", true);

    }

}