package org.example.camunda.process.solution.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.example.camunda.process.solution.facade.dto.AuthUser;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.adapters.KeycloakDeployment;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.springframework.stereotype.Service;

@Service
public class KeycloakService {

  public void logout(HttpServletRequest request) {

    RefreshableKeycloakSecurityContext ksc =
        ((RefreshableKeycloakSecurityContext) getKeycloakSecurityContext(request));
    KeycloakDeployment d = ksc.getDeployment();
    ksc.logout(ksc.getDeployment());
    HttpSession session = request.getSession(false);
    if (session != null) {
      session.invalidate();
    }
  }

  public KeycloakSecurityContext getKeycloakSecurityContext(HttpServletRequest request) {
    return (KeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());
  }

  public String getUsername(HttpServletRequest request) {
    KeycloakSecurityContext context = getKeycloakSecurityContext(request);
    return context.getIdToken().getGivenName();
  }

  public AuthUser getUser(HttpServletRequest request) {
    AuthUser user = new AuthUser();
    KeycloakSecurityContext context = getKeycloakSecurityContext(request);
    Set<String> roles = context.getToken().getRealmAccess().getRoles();
    user.setUsername(context.getIdToken().getGivenName());
    user.setEmail(context.getIdToken().getEmail());
    user.setProfile("User");
    if (roles.contains("Admin")) {
      user.setProfile("Admin");
    } else if (roles.contains("Editor")) {
      user.setProfile("Editor");
    }
    Map<String, Object> otherClaims = context.getIdToken().getOtherClaims();
    if (otherClaims.containsKey("groups")) {
      List<String> groups = (List<String>) otherClaims.get("groups");
      user.setGroups(new HashSet<>(groups));
    }
    return user;
  }
}
