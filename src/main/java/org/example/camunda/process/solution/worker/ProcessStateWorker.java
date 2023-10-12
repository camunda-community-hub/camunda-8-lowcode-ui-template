package org.example.camunda.process.solution.worker;

import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import org.example.camunda.process.solution.service.ConversationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProcessStateWorker {

  private static final Logger LOG = LoggerFactory.getLogger(ProcessStateWorker.class);

  @Autowired private ConversationRepository conversationRepository;

  @JobWorker(type = "processState")
  public Map<String, Object> processState(ActivatedJob activatedJob) {
    Map<String, Object> processVars = activatedJob.getVariablesAsMap();
    String myId = (String) activatedJob.getVariablesAsMap().get("myId");

    // get CompletableFuture (created in Service)
    CompletableFuture<Map<String, Object>> camundaJobConversation =
        conversationRepository.getConversation(myId);

    // push result via `complete` into CompletableFuture
    if (camundaJobConversation != null) {
      try {
        camundaJobConversation.complete(processVars);
      } catch (CompletionException e) {
        e.printStackTrace();
      } finally {
        conversationRepository.removeConversation(myId);
      }
    }

    return processVars;
  }
}
