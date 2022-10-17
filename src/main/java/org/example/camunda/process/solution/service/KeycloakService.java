package org.example.camunda.process.solution.service;

import org.example.camunda.process.solution.exception.TechnicalException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class KeycloakService {

  @Autowired private RestTemplate restTemplate;

  @Value("${keycloak.auth-server-url:http://localhost:18080/auth}")
  private String keycloakServer;

  @Value("${keycloak.realm:camunda-platform}")
  private String keycloakRealm;

  @Value("${keycloak.resource}")
  private String keycloakClientId;

  public void logout(String refreshToken) {
    String endSessionEndpoint =
        keycloakServer + "/realms/" + keycloakRealm + "/protocol/openid-connect/logout";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
    map.add("client_id", keycloakClientId);
    map.add("refresh_token", refreshToken);

    HttpEntity<MultiValueMap<String, String>> request =
        new HttpEntity<MultiValueMap<String, String>>(map, headers);

    ResponseEntity<String> logoutResponse =
        restTemplate.postForEntity(endSessionEndpoint, request, String.class);

    if (!logoutResponse.getStatusCode().is2xxSuccessful()) {
      throw new TechnicalException(
          "Could not propagate logout to Keycloak, HTTP code "
              + logoutResponse.getStatusCode().value());
    }
  }
}
