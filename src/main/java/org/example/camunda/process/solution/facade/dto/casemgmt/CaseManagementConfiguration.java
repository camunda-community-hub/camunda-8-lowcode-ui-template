package org.example.camunda.process.solution.facade.dto.casemgmt;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CaseManagementConfiguration {

  private Map<String, List<MessageConf>> bpmnProcessIdMessages;

  public Map<String, List<MessageConf>> getBpmnProcessIdMessages() {
    return bpmnProcessIdMessages;
  }

  public void setBpmnProcessIdMessages(Map<String, List<MessageConf>> bpmnProcessIdMessages) {
    this.bpmnProcessIdMessages = bpmnProcessIdMessages;
  }

  public boolean contains(String bpmnProcessId) {
    if (bpmnProcessIdMessages != null && bpmnProcessIdMessages.containsKey(bpmnProcessId)) {
      return true;
    }
    return false;
  }

  public List<MessageConf> getMessagesConf(String bpmnProcessId) {
    if (contains(bpmnProcessId)) {
      return bpmnProcessIdMessages.get(bpmnProcessId);
    }
    return new ArrayList<>();
  }
}
