package org.example.camunda.process.solution.service;

import io.camunda.operate.CamundaOperateClient;
import io.camunda.operate.auth.SaasAuthentication;
import io.camunda.operate.auth.SelfManagedAuthentication;
import io.camunda.operate.dto.ProcessDefinition;
import io.camunda.operate.exception.OperateException;
import io.camunda.operate.search.ProcessDefinitionFilter;
import io.camunda.operate.search.SearchQuery;
import io.camunda.operate.search.Sort;
import io.camunda.operate.search.SortOrder;
import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

@Service
@EnableCaching
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

  @Value("${keycloakUrl}")
  private String keycloakUrl;

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
        SelfManagedAuthentication la =
            new SelfManagedAuthentication()
                .clientId(identityClientId)
                .clientSecret(identityClientSecret)
                .keycloakUrl(keycloakUrl);
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

  public List<ProcessDefinition> getProcessDefinitionByKey(Long key) throws OperateException {
    ProcessDefinitionFilter processDefinitionFilter = new ProcessDefinitionFilter.Builder().build();
    SearchQuery procDefQuery =
        new SearchQuery.Builder()
            .withFilter(processDefinitionFilter)
            .withSize(1000)
            .withSort(new Sort("version", SortOrder.DESC))
            .build();

    return getCamundaOperateClient().searchProcessDefinitions(procDefQuery);
  }

  @Cacheable("processXmls")
  public String getProcessDefinitionXmlByKey(Long key) throws OperateException {
    System.out.println("Entering getProcessDefinitionXmlByKey for key " + key);
    List<ProcessDefinition> processDefs = getProcessDefinitions();
    Map<Object, Object> processXmls;
    processXmls =
        processDefs.stream()
            .map(
                processDef -> {
                  try {
                    AbstractMap.SimpleEntry<Long, String> entry =
                        new AbstractMap.SimpleEntry<>(
                            processDef.getKey(),
                            getCamundaOperateClient().getProcessDefinitionXml(processDef.getKey()));
                    return entry;

                  } catch (OperateException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    return new AbstractMap.SimpleEntry<>(key, "NOT FOUND");
                  }
                })
            .collect(
                Collectors.toMap(
                    AbstractMap.SimpleEntry::getKey, AbstractMap.SimpleEntry::getValue));

    return processXmls.get(key).toString();
  }
}
