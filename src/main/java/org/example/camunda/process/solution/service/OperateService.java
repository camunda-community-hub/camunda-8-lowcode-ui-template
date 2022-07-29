package org.example.camunda.process.solution.service;

import io.camunda.operate.CamundaOperateClient;
import io.camunda.operate.auth.SaasAuthentication;
import io.camunda.operate.dto.ProcessDefinition;
import io.camunda.operate.exception.OperateException;
import io.camunda.operate.search.ProcessDefinitionFilter;
import io.camunda.operate.search.SearchQuery;
import io.camunda.operate.search.Sort;
import io.camunda.operate.search.SortOrder;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OperateService {

  @Value("${zeebe.client.cloud.client-id}")
  private String clientId;

  @Value("${zeebe.client.cloud.client-secret}")
  private String clientSecret;

  @Value("${zeebe.client.cloud.clusterId}")
  private String clusterId;

  @Value("${zeebe.client.cloud.region}")
  private String region;

  private CamundaOperateClient client;

  private CamundaOperateClient getCamundaTaskListClient() throws OperateException {
    if (client == null) {
      SaasAuthentication sa = new SaasAuthentication(clientId, clientSecret);
      client =
          new CamundaOperateClient.Builder()
              .operateUrl("https://" + region + ".operate.camunda.io/" + clusterId)
              .authentication(sa)
              .build();
    }
    return client;
  }

  public List<ProcessDefinition> getProcessDefinitions() throws OperateException {
    ProcessDefinitionFilter processDefinitionFilter = new ProcessDefinitionFilter.Builder().build();
    SearchQuery procDefQuery =
        new SearchQuery.Builder()
            .withFilter(processDefinitionFilter)
            .withSize(1000)
            .withSort(new Sort("version", SortOrder.DESC))
            .build();

    return getCamundaTaskListClient().searchProcessDefinitions(procDefQuery);
  }
}
