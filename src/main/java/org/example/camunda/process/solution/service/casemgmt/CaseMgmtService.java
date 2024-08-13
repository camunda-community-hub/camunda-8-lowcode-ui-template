package org.example.camunda.process.solution.service.casemgmt;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.example.camunda.process.solution.facade.dto.casemgmt.CaseManagementConfiguration;
import org.example.camunda.process.solution.facade.dto.casemgmt.MessageConf;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CaseMgmtService {

  public static final String CASEMGMT = "casemgmt.json";

  @Value("${workspace:workspace}")
  private String workspace;

  private static CaseManagementConfiguration INSTANCE;

  public Path resolve() {
    return Path.of(workspace).resolve(CASEMGMT);
  }

  public CaseManagementConfiguration get() throws IOException {
    if (INSTANCE == null) {
      try {
        INSTANCE = JsonUtils.fromJsonFile(resolve(), CaseManagementConfiguration.class);
      } catch (Exception e) {
        INSTANCE = new CaseManagementConfiguration();
        INSTANCE.setBpmnProcessIdMessages(new HashMap<>());
      }
    }
    return INSTANCE;
  }

  public CaseManagementConfiguration save(CaseManagementConfiguration conf) throws IOException {
    JsonUtils.toJsonFile(resolve(), conf);
    INSTANCE = conf;
    return INSTANCE;
  }

  private List<MessageConf> getByBpmnProcessId(String bpmnProcessId) throws IOException {
    return get().getMessagesConf(bpmnProcessId);
  }

  public List<MessageConf> getMessagesConf(String bpmnProcessId) throws IOException {
    return getMessagesConf(bpmnProcessId, "zorglub");
  }

  public List<MessageConf> getMessagesConf(String bpmnProcessId, String elementId)
      throws IOException {
    List<MessageConf> result = new ArrayList<>();
    for (MessageConf conf : getByBpmnProcessId(bpmnProcessId)) {
      if (conf.isEnabled()
          && (conf.getElementId() == null || elementId.equals(conf.getElementId()))) {
        result.add(conf);
      }
    }
    return result;
  }

  public MessageConf getConfByMessage(String bpmnProcessId, String message) throws IOException {

    for (MessageConf conf : getByBpmnProcessId(bpmnProcessId)) {
      if (conf.isEnabled() && message.equals(conf.getMessage())) {
        return conf;
      }
    }
    return null;
  }
}
