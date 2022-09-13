package org.example.camunda.process.solution.facade;

import org.example.camunda.process.solution.exception.UnauthorizedException;
import org.example.camunda.process.solution.facade.dto.AuthUser;
import org.example.camunda.process.solution.facade.dto.Authentication;
import org.example.camunda.process.solution.model.User;
import org.example.camunda.process.solution.service.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

  private final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

  @Autowired private OrganizationService organizationService;

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

  private AuthUser getAuthUser(User user) {
    AuthUser authUser = new AuthUser();
    BeanUtils.copyProperties(user, authUser);

    // authUser.setToken(SecurityUtils.getJWTToken(user));
    return authUser;
  }
}
