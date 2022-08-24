package org.example.camunda.process.solution.facade;

import org.example.camunda.process.solution.facade.dto.AuthUser;
import org.example.camunda.process.solution.facade.dto.Authentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

  private final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

  @RequestMapping(value = "/login", method = RequestMethod.POST, produces = "application/json")
  @ResponseStatus(HttpStatus.OK)
  public AuthUser login(@RequestBody Authentication auth) {
    AuthUser loggedUser = new AuthUser();
    loggedUser.setUsername(auth.getUsername());
    return loggedUser;
  }
}
