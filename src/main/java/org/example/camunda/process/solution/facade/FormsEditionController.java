package org.example.camunda.process.solution.facade;

import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import java.util.List;
import org.example.camunda.process.solution.facade.dto.Form;
import org.example.camunda.process.solution.service.FormService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/edition/forms")
@CrossOrigin(origins = "*")
public class FormsEditionController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(FormsEditionController.class);

  @Autowired private FormService formService;

  @PostMapping
  public ResponseEntity<Form> save(@RequestBody Form form) throws IOException {
    formService.saveForm(form);
    return new ResponseEntity<>(form, HttpStatus.CREATED);
  }

  @GetMapping("/{formKey}")
  @ResponseBody
  public Form getForm(@PathVariable String formKey) throws TaskListException, IOException {
    return formService.findByName(formKey);
  }

  @DeleteMapping("/{formKey}")
  public void deleteForm(@PathVariable String formKey) throws TaskListException, IOException {
    formService.deleteByName(formKey);
  }

  @GetMapping(value = "/names")
  @ResponseBody
  public List<String> formNames() {
    return formService.findNames();
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
