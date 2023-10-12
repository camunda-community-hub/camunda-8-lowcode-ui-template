package org.example.camunda.process.solution.service;

import io.camunda.zeebe.client.api.command.PublishMessageCommandStep1;
import io.camunda.zeebe.client.api.response.PublishMessageResponse;
import io.github.resilience4j.retry.annotation.Retry;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MessageSender {

  private static final Logger LOG = LoggerFactory.getLogger(MessageSender.class);

  /** Moved to a separate class, so @Retry can be applied */
  @Retry(name = "sendMessage")
  public CompletableFuture<PublishMessageResponse> sendMessage(
      PublishMessageCommandStep1.PublishMessageCommandStep3 message) {
    LOG.info("Sending message for message=`{}`", message);

    return message.send().toCompletableFuture();
  }
}
