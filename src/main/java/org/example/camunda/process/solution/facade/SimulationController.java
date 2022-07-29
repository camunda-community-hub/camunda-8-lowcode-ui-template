package org.example.camunda.process.solution.facade;

import java.util.List;
import org.example.camunda.process.solution.facade.dto.FormJsListValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/simul")
@CrossOrigin(origins = "*")
public class SimulationController {

  @GetMapping("/checklist")
  public List<FormJsListValue> getChecklist() {
    return List.of(new FormJsListValue("1", "choice 1"), new FormJsListValue("2", "choice 2"));
  }
}
