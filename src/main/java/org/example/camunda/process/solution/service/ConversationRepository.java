package org.example.camunda.process.solution.service;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Repository;

@Repository
public class ConversationRepository {

  private final ConcurrentMap<String, CompletableFuture<Map<String, Object>>> conversations =
      new ConcurrentHashMap<>();

  public void addConversation(
      String parcelId, CompletableFuture<Map<String, Object>> conversation) {
    conversations.put(parcelId, conversation);
  }

  public CompletableFuture<Map<String, Object>> getConversation(String parcelId) {
    return conversations.get(parcelId);
  }

  public void removeConversation(String parcelId) {
    conversations.remove(parcelId);
  }
}
