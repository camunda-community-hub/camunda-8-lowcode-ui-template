package org.example.camunda.process.solution.dao;

import org.example.camunda.process.solution.model.TaskToken;

public interface TaskTokenRepository extends BaseRepository<TaskToken> {

    TaskToken findByToken(String token);

    Long deleteByTaskId(String taskId);

}
