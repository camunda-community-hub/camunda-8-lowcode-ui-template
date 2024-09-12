package org.example.camunda.process.solution.facade;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class ReactAppController {

  @RequestMapping(value = {"/home", "/admin/**", "/tasklist/**"})
  public String getIndex(HttpServletRequest request) {
    return "/";
  }

  @GetMapping(value = {"", "/sso/login"})
  public RedirectView redirectWithUsingRedirectView(RedirectAttributes attributes) {
    return new RedirectView("/home");
  }
}
