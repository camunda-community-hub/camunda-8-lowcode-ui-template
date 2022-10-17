package org.example.camunda.process.solution.facade;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.example.camunda.process.solution.exception.TechnicalException;
import org.example.camunda.process.solution.exception.UnauthorizedException;
import org.example.camunda.process.solution.facade.dto.AuthUser;
import org.example.camunda.process.solution.security.SecurityUtils;
import org.example.camunda.process.solution.security.UserPrincipal;
import org.keycloak.KeycloakSecurityContext;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public abstract class AbstractController {

  @Value("${keycloak.enabled:false}")
  private String keycloakEnabled;

  @Autowired private HttpServletRequest request;

  public abstract Logger getLogger();

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<Map<String, String>> unauthorizedExceptionHandler(UnauthorizedException e) {
    getLogger().warn("Handling unauthorized access exception", e);
    Map<String, String> response = new HashMap<>();
    response.put("status", "error");
    response.put("message", e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
  }

  @ExceptionHandler(TechnicalException.class)
  public ResponseEntity<Map<String, String>> technicalExceptionHandler(TechnicalException e) {
    getLogger().warn("Handling technical exception", e);
    Map<String, String> response = new HashMap<>();
    response.put("status", "error");
    response.put("message", e.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }

  @ExceptionHandler(MissingRequestHeaderException.class)
  public ResponseEntity<Map<String, String>> handleMissingParams(MissingRequestHeaderException ex) {
    String name = ex.getHeaderName();
    getLogger().warn(name + " header is missing");
    Map<String, String> response = new HashMap<>();
    if (name.equals("Authorization")) {
      response.put("status", "error");
      response.put("message", "Authorization header required ");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    response.put("status", "error");
    response.put("message", name + " header is missing");
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  protected String getServerHost() {
    return request
        .getRequestURL()
        .substring(0, request.getRequestURL().length() - request.getRequestURI().length());
  }

  protected HttpServletRequest getRequest() {
    return request;
  }

  protected HttpServletResponse getHttpServletResponse() {
    return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
        .getResponse();
  }

  protected boolean isKeycloakAuth() {
    return Boolean.valueOf(keycloakEnabled);
  }

  protected KeycloakSecurityContext getKeycloakSecurityContext() {
    return (KeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());
  }

  protected AuthUser getAuthenticatedUser() {
    AuthUser user = new AuthUser();
    if (isKeycloakAuth()) {
      KeycloakSecurityContext context = getKeycloakSecurityContext();
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
    } else {
      UserPrincipal jwtUser = SecurityUtils.getConnectedUser();
      user.setUsername(jwtUser.getUsername());
      user.setEmail(jwtUser.getEmail());
    }
    return user;
  }
}
