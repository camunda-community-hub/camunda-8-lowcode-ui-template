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
import io.camunda.operate.model.ProcessDefinition;
import io.camunda.operate.model.Variable;
import io.camunda.operate.search.ProcessDefinitionFilter;
import io.camunda.operate.search.SearchQuery;
import io.camunda.operate.search.Sort;
import io.camunda.operate.search.SortOrder;
import io.camunda.operate.search.VariableFilter;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
}
