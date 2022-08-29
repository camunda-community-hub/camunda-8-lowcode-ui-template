package org.example.camunda.process.solution.service;

import io.camunda.operate.CamundaOperateClient;
import io.camunda.operate.auth.LocalIdentityAuthentication;
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

  @Value("${zeebe.client.cloud.client-id:notProvided}")
  private String clientId;

  @Value("${zeebe.client.cloud.client-secret:notProvided}")
  private String clientSecret;

  @Value("${zeebe.client.cloud.clusterId:notProvided}")
  private String clusterId;

  @Value("${zeebe.client.cloud.region:notProvided}")
  private String region;

  @Value("${identity.clientId:notProvided}")
  private String identityClientId;

  @Value("${identity.clientSecret:notProvided}")
  private String identityClientSecret;

  @Value("${operateUrl:notProvided}")
  private String operateUrl;

  private CamundaOperateClient client;

  private CamundaOperateClient getCamundaOperateClient() throws OperateException {
    if (client == null) {
      if (!"notProvided".equals(clientId)) {
        SaasAuthentication sa = new SaasAuthentication(clientId, clientSecret);
        client =
            new CamundaOperateClient.Builder()
                .operateUrl("https://" + region + ".operate.camunda.io/" + clusterId)
                .authentication(sa)
                .build();
      } else {
        LocalIdentityAuthentication la =
            new LocalIdentityAuthentication()
                .clientId(identityClientId)
                .clientSecret(identityClientSecret);
        client =
            new CamundaOperateClient.Builder().operateUrl(operateUrl).authentication(la).build();
      }
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

    return getCamundaOperateClient().searchProcessDefinitions(procDefQuery);
  }
}
