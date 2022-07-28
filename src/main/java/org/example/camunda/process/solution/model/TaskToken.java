package org.example.camunda.process.solution.model;

import javax.persistence.Entity;

@Entity
public class TaskToken extends BaseEntity {

    private String token;
    private String taskId;
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getTaskId() {
        return taskId;
    }
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }
}
