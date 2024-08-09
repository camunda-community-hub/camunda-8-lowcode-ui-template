package org.example.camunda.process.solution.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Task;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public class SseEmitterManager {
  private static Map<String, SseEmitter> emitterMap = new HashMap<>();

  public static SseEmitter getEmitter(String userId) {
    if (!emitterMap.containsKey(userId)) {
      SseEmitter emitter = new SseEmitter();
      emitterMap.put(userId, emitter);

      emitter.onTimeout(
          () -> {
            emitter.complete();
            SseEmitterManager.removeEmitter(userId);
          });

      // Set a handler for client disconnect (optional)
      emitter.onCompletion(
          () -> {
            SseEmitterManager.removeEmitter(userId);
          });
    }

    return emitterMap.get(userId);
  }

  public static void removeEmitter(String operationKey) {
    emitterMap.remove(operationKey);
  }

  public static void send(String userId, Task task) throws IOException {
    getEmitter(userId).send(task);
  }

  public static void broadcast(Task task) throws IOException {
    for (String userId : emitterMap.keySet()) {
      send(userId, task);
    }
  }
}
