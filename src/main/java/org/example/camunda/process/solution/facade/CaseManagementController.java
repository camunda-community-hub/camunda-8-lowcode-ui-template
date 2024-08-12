package org.example.camunda.process.solution.facade;

import java.io.IOException;
import java.util.List;
import org.example.camunda.process.solution.facade.dto.casemgmt.CaseManagementConfiguration;
import org.example.camunda.process.solution.facade.dto.casemgmt.MessageConf;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
import org.example.camunda.process.solution.security.annotation.IsEditor;
import org.example.camunda.process.solution.service.casemgmt.CaseMgmtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/casemgmt")
public class CaseManagementController {

  private static final Logger LOG = LoggerFactory.getLogger(CaseManagementController.class);
  private final CaseMgmtService caseMgmtService;

  public CaseManagementController(CaseMgmtService caseMgmtService) {
    this.caseMgmtService = caseMgmtService;
  }

  @IsEditor
  @GetMapping
  public CaseManagementConfiguration getConf() throws IOException {
    return caseMgmtService.get();
  }

  @IsEditor
  @PostMapping
  public CaseManagementConfiguration save(@RequestBody CaseManagementConfiguration conf)
      throws IOException {
    return caseMgmtService.save(conf);
  }

  @IsAuthenticated
  @GetMapping("/messages/{bpmnProcessId}")
  public List<MessageConf> getMessages(@PathVariable String bpmnProcessId) throws IOException {
    return caseMgmtService.getMessagesConf(bpmnProcessId);
  }

  @IsAuthenticated
  @GetMapping("/messages/{bpmnProcessId}/{elementId}")
  public List<MessageConf> getMessages(
      @PathVariable String bpmnProcessId, @PathVariable String elementId) throws IOException {
    return caseMgmtService.getMessagesConf(bpmnProcessId, elementId);
  }
}
