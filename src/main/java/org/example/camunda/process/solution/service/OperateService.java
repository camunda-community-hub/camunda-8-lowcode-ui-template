package org.example.camunda.process.solution.service;

import com.fasterxml.jackson.databind.JsonNode;
import io.camunda.common.auth.Authentication;
import io.camunda.common.auth.JwtConfig;
import io.camunda.common.auth.JwtCredential;
import io.camunda.common.auth.Product;
import io.camunda.common.auth.SaaSAuthentication;
import io.camunda.common.auth.SelfManagedAuthentication;
import io.camunda.common.auth.identity.IdentityConfig;
import io.camunda.common.auth.identity.IdentityContainer;
import io.camunda.common.json.SdkObjectMapper;
import io.camunda.identity.sdk.Identity;
import io.camunda.identity.sdk.IdentityConfiguration;
import io.camunda.operate.CamundaOperateClient;
import io.camunda.operate.exception.OperateException;
import io.camunda.operate.model.FlowNodeInstance;
import io.camunda.operate.model.ProcessDefinition;
import io.camunda.operate.model.ProcessInstance;
import io.camunda.operate.model.ProcessInstanceState;
import io.camunda.operate.model.SearchResult;
import io.camunda.operate.model.Variable;
import io.camunda.operate.search.FlowNodeInstanceFilter;
import io.camunda.operate.search.ProcessDefinitionFilter;
import io.camunda.operate.search.ProcessInstanceFilter;
import io.camunda.operate.search.SearchQuery;
import io.camunda.operate.search.Sort;
import io.camunda.operate.search.SortOrder;
import io.camunda.operate.search.VariableFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

@Service
@EnableCaching
public class OperateService {

  private static final Logger LOG = LoggerFactory.getLogger(OperateService.class);

  @Value("${zeebe.client.cloud.clientId:notProvided}")
  private String clientId;

  @Value("${zeebe.client.cloud.clientSecret:notProvided}")
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

  @Value("${keycloakUrl:notProvided}")
  private String keycloakUrl;

  private CamundaOperateClient client;

  private CamundaOperateClient getCamundaOperateClient() throws OperateException {
    if (client == null) {
      String targetOperateUrl = operateUrl;
      Authentication auth = null;
      if (!"notProvided".equals(clientId)) {
        JwtConfig jwtConfig = new JwtConfig();
        jwtConfig.addProduct(
            Product.OPERATE,
            new JwtCredential(
                clientId,
                clientSecret,
                "operate.camunda.io",
                "https://login.cloud.camunda.io/oauth/token"));
        targetOperateUrl = "https://" + region + ".operate.camunda.io/" + clusterId;
        auth =
            SaaSAuthentication.builder()
                .withJwtConfig(jwtConfig)
                .withJsonMapper(new SdkObjectMapper())
                .build();
      } else {
        String tokenUrl = keycloakUrl;
        IdentityConfig identityConfig = new IdentityConfig();
        IdentityConfiguration identityConfiguration =
            new IdentityConfiguration(
                tokenUrl, tokenUrl, identityClientId, identityClientSecret, identityClientId);
        Identity identity = new Identity(identityConfiguration);
        identityConfig.addProduct(
            Product.OPERATE, new IdentityContainer(identity, identityConfiguration));

        JwtConfig jwtConfig = new JwtConfig();
        jwtConfig.addProduct(
            Product.OPERATE,
            new JwtCredential(identityClientId, identityClientSecret, identityClientId, tokenUrl));
        auth =
            SelfManagedAuthentication.builder()
                .withJwtConfig(jwtConfig)
                .withIdentityConfig(identityConfig)
                .build();
      }
      client =
          CamundaOperateClient.builder()
              .operateUrl(targetOperateUrl)
              .authentication(auth)
              .setup()
              .build();
    }
    return client;
  }

  public List<ProcessDefinition> getProcessDefinitions() throws OperateException {
    ProcessDefinitionFilter processDefinitionFilter = ProcessDefinitionFilter.builder().build();
    SearchQuery procDefQuery =
        new SearchQuery.Builder()
            .filter(processDefinitionFilter)
            .size(1000)
            .sort(new Sort("version", SortOrder.DESC))
            .build();

    return getCamundaOperateClient().searchProcessDefinitions(procDefQuery);
  }

  @Cacheable("processXmls")
  public String getProcessDefinitionXmlByKey(Long key) throws OperateException {
    LOG.info("Entering getProcessDefinitionXmlByKey for key " + key);
    return getCamundaOperateClient().getProcessDefinitionXml(key);
  }

  public Map<String, Set<JsonNode>> listVariables() throws OperateException, IOException {
    List<Variable> vars =
        getCamundaOperateClient()
            .searchVariables(
                new SearchQuery.Builder().filter(new VariableFilter()).size(1000).build());
    Map<String, Set<JsonNode>> result = new HashMap<>();
    for (Variable var : vars) {
      if (!result.containsKey(var.getName())) {
        result.put(var.getName(), new HashSet<>());
      }
      result.get(var.getName()).add(JsonUtils.toJsonNode(var.getValue()));
    }
    return result;
  }

  public SearchResult<ProcessInstance> getProcessInstances(
      String bpmnProcessId, ProcessInstanceState state, Integer pageSize, Long after)
      throws OperateException {
    SearchQuery q =
        new SearchQuery.Builder()
            .filter(
                ProcessInstanceFilter.builder().state(state).bpmnProcessId(bpmnProcessId).build())
            .size(pageSize)
            .build();
    if (after != null) {
      q.setSearchAfter(List.of(after));
    }
    return getCamundaOperateClient().searchProcessInstanceResults(q);
  }

  public List<Variable> getVariables(Long processInstanceKey) throws OperateException {
    return getCamundaOperateClient()
        .searchVariables(
            new SearchQuery.Builder()
                .filter(VariableFilter.builder().processInstanceKey(processInstanceKey).build())
                .size(1000)
                .build());
  }

  public Map<Long, Map<String, Object>> getVariables(List<ProcessInstance> processInstances)
      throws OperateException {
    try {
      Map<Long, Future<List<Variable>>> futures = new HashMap<>();
      Map<Long, Map<String, Object>> instanceMap = new HashMap<>();
      for (ProcessInstance instance : processInstances) {
        instanceMap.put(instance.getKey(), new HashMap<>());
        futures.put(
            instance.getKey(),
            CompletableFuture.supplyAsync(
                () -> {
                  try {
                    return getVariables(instance.getKey());
                  } catch (OperateException e) {
                    return null;
                  }
                }));
      }
      for (Map.Entry<Long, Future<List<Variable>>> varFutures : futures.entrySet()) {
        List<Variable> vars = varFutures.getValue().get();
        for (Variable var : vars) {
          instanceMap.get(varFutures.getKey()).put(var.getName(), var.getValue());
        }
      }
      futures.clear();
      return instanceMap;
    } catch (ExecutionException | InterruptedException e) {
      throw new OperateException("Error loading instances variables", e);
    }
  }

  public List<Long> getSubProcessInstances(Long processInstanceKey) throws OperateException {
    SearchQuery q =
        new SearchQuery.Builder()
            .filter(
                ProcessInstanceFilter.builder()
                    .parentKey(processInstanceKey)
                    .state(ProcessInstanceState.ACTIVE)
                    .build())
            .size(100)
            .build();

    List<ProcessInstance> subprocs = getCamundaOperateClient().searchProcessInstances(q);
    List<Long> result = new ArrayList<>();
    for (ProcessInstance i : subprocs) {
      result.add(i.getKey());
      result.addAll(getSubProcessInstances(i.getKey()));
    }

    return result;
  }

  public List<FlowNodeInstance> getProcessInstanceHistory(Long processInstanceKey)
      throws OperateException {
    FlowNodeInstanceFilter flowNodeFilter =
        FlowNodeInstanceFilter.builder().processInstanceKey(processInstanceKey).build();
    SearchQuery procInstQuery =
        new SearchQuery.Builder()
            .filter(flowNodeFilter)
            .size(1000)
            .sort(new Sort("startDate", SortOrder.DESC))
            .build();

    return getCamundaOperateClient().searchFlowNodeInstances(procInstQuery);
  }
}
