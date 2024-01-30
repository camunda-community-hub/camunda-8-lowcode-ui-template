package org.example.camunda.process.solution.facade;

import jakarta.servlet.http.HttpSession;
import org.example.camunda.process.solution.exception.UnauthorizedException;
import org.example.camunda.process.solution.facade.dto.AuthUser;
import org.example.camunda.process.solution.facade.dto.Authentication;
import org.example.camunda.process.solution.jsonmodel.User;
import org.example.camunda.process.solution.security.SecurityUtils;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
import org.example.camunda.process.solution.service.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

  @Value("${spring.security.oauth2.enabled:false}")
  private Boolean oauth2Enabled;

  private OrganizationService organizationService;

  public AuthenticationController(OrganizationService organizationService) {
    this.organizationService = organizationService;
  }

  @RequestMapping(value = "/login", method = RequestMethod.POST, produces = "application/json")
  @ResponseStatus(HttpStatus.OK)
  public AuthUser login(@RequestBody Authentication auth) {
    User user =
        organizationService.getUserByUsernameAndPassword(auth.getUsername(), auth.getPassword());
    if (user == null) {
      throw new UnauthorizedException("Credentials not recognized");
    }
    return getAuthUser(user);
  }

  @IsAuthenticated
  @GetMapping("/user")
  public AuthUser getUser() {
    if (oauth2Enabled) {
      return SecurityUtils.getOAuth2User();
    }
    User user = organizationService.getUserByUsername(getAuthenticatedUsername());
    return SecurityUtils.getAuthUser(user);
  }

  @GetMapping("/logout")
  public void logout() {
    HttpSession session = getRequest().getSession(false);
    if (session != null) {
      session.invalidate();
    }
  }

  private AuthUser getAuthUser(User user) {
    AuthUser authUser = new AuthUser();
    if (user == null) {
      authUser.setUsername("anonymous");
      return authUser;
    }
    BeanUtils.copyProperties(user, authUser);
    authUser.setToken(SecurityUtils.getJWTToken(user));
    return authUser;
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
