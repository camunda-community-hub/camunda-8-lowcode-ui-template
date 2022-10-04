package org.example.camunda.process.solution.facade;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactAppController {

  @RequestMapping(value = {"/admin/**", "/tasklist/**"})
  public String getIndex(HttpServletRequest request) {
    return "/index.html";
  }
}
