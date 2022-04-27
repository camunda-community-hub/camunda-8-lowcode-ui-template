package org.example.camunda.process.solution;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.camunda.zeebe.spring.client.EnableZeebeClient;
import io.camunda.zeebe.spring.client.annotation.ZeebeDeployment;

@SpringBootApplication
@EnableZeebeClient
@ZeebeDeployment(resources = "classpath*:/models/*.*")
public class ProcessApplication {

  public static void main(String[] args) {
    SpringApplication.run(ProcessApplication.class, args);
  }

}
