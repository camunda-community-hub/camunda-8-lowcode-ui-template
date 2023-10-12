package org.example.camunda.process.solution.service;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.ZeebeFuture;
import io.camunda.zeebe.client.api.command.PublishMessageCommandStep1;
import io.camunda.zeebe.client.api.response.PublishMessageResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.example.camunda.process.solution.ProcessConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyService {

  private static final Logger LOG = LoggerFactory.getLogger(MyService.class);

  @Autowired private ZeebeClient zeebeClient;
  @Autowired private ConversationRepository conversationRepository;
  @Autowired private MessageSender messageSender;

  public CompletableFuture<?> startProcessInstance(Map<String, Object> variables) {
    return zeebeClient
        .newPublishMessageCommand()
        .messageName(ProcessConstants.START)
        .correlationKey((String) variables.get("myId"))
        .variables(variables)
        .send()
        .toCompletableFuture();
  }

  /** will request process state at the beginning and then create and send messages A, B, and C */
  public CompletableFuture<?> updateProcessInstance(String myId) {
    LOG.info("updateProcessInstance for myId=`{}`", myId);
    return sendMessageToRequestProcessState(myId)
        .thenCompose(publishMessageResponse -> getProcessVarsCompletableFuture(myId))
        .thenApply(x -> createMessageCommands(myId))
        .thenCompose(x -> sendMessages(x))
        .thenApply(
            x -> {
              LOG.info("some additional computation could happen here");
              return x;
            })
        .toCompletableFuture();
  }

  private ZeebeFuture<PublishMessageResponse> sendMessageToRequestProcessState(String myId) {
    LOG.info("sendMessageToRequestProcessState for myId=`{}`", myId);
    return zeebeClient
        .newPublishMessageCommand()
        .messageName(ProcessConstants.MSG_PROCESS_STATE)
        .correlationKey(myId)
        .send();
  }

  private CompletableFuture<Map<String, Object>> getProcessVarsCompletableFuture(String myId) {
    LOG.info("getProcessVarsCompletableFuture for myId=`{}`", myId);
    CompletableFuture<Map<String, Object>> processVarsFuture = new CompletableFuture<>();
    conversationRepository.addConversation(myId, processVarsFuture);
    return processVarsFuture
        .orTimeout(30, TimeUnit.SECONDS)
        .exceptionally(
            throwable -> {
              if (throwable instanceof TimeoutException) {
                conversationRepository.removeConversation(myId);
              }
              throw new ProcessDoesntExistInCamundaException(throwable);
            });
  }

  private List<PublishMessageCommandStep1.PublishMessageCommandStep3> createMessageCommands(
      String myId) {
    LOG.info("createMessageCommands for myId=`{}`", myId);
    return ProcessConstants.MESSAGES.stream()
        .map(
            message ->
                zeebeClient
                    .newPublishMessageCommand()
                    .messageName(message)
                    .correlationKey(myId)
                    .variables(Map.of(message, LocalDateTime.now())))
        .toList();
  }

  private CompletableFuture sendMessages(
      List<PublishMessageCommandStep1.PublishMessageCommandStep3> messageCommands) {
    LOG.info("sendMessages for messages=`{}`", messageCommands);

    CompletableFuture<PublishMessageResponse>[] finalStepsAsCompletableFutureArray =
        messageCommands.stream()
            .map(message -> messageSender.sendMessage(message))
            .toList()
            .toArray(new CompletableFuture[0]);

    return CompletableFuture.allOf(finalStepsAsCompletableFutureArray);
  }
}
