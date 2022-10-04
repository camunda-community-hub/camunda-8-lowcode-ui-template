package org.example.camunda.process.solution.facade;

import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import java.util.List;
import org.example.camunda.process.solution.jsonmodel.MailTemplate;
import org.example.camunda.process.solution.security.annontation.IsEditor;
import org.example.camunda.process.solution.service.MailTemplateService;
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

@CrossOrigin
@RestController
@RequestMapping("/api/edition/mails")
public class MailEditionController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(MailEditionController.class);

  @Autowired private MailTemplateService mailTemplateService;

  @IsEditor
  @PostMapping
  public ResponseEntity<MailTemplate> save(@RequestBody MailTemplate mailTemplate)
      throws IOException {
    mailTemplateService.saveMail(mailTemplate);
    return new ResponseEntity<>(mailTemplate, HttpStatus.CREATED);
  }

  @IsEditor
  @GetMapping("/{templateName}")
  @ResponseBody
  public MailTemplate getMailTemplate(@PathVariable String templateName)
      throws TaskListException, IOException {
    return mailTemplateService.findByName(templateName);
  }

  @IsEditor
  @DeleteMapping("/{templateName}")
  public void deleteForm(@PathVariable String templateName) throws TaskListException, IOException {
    mailTemplateService.deleteByName(templateName);
  }

  @IsEditor
  @GetMapping(value = "/names")
  @ResponseBody
  public List<String> formNames() {
    return mailTemplateService.findNames();
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
