package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.Collection;
import org.example.camunda.process.solution.facade.dto.WorkerDefinition;
import org.example.camunda.process.solution.security.annotation.IsEditor;
import org.example.camunda.process.solution.service.ElementTemplateService;
import org.example.camunda.process.solution.utils.ConnectorTemplateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/elttemplates")
public class ElementTemplateController {

  @Autowired private ElementTemplateService elementTemplateService;

  @IsEditor
  @GetMapping
  @ResponseBody
  public Collection<WorkerDefinition> getWorkers() {
    return elementTemplateService.getWorkers();
  }

  @IsEditor
  @GetMapping("/{workerType}")
  @ResponseBody
  public JsonNode eltTemplate(@PathVariable String workerType) throws IOException {
    try {
      return elementTemplateService.findByName(workerType);
    } catch (Exception e) {
      WorkerDefinition def = elementTemplateService.getWorkerDef(workerType);
      return ConnectorTemplateUtils.generateElementTemplate(def);
    }
  }

  @IsEditor
  @PostMapping("/{workerType}")
  public void saveTemplate(@PathVariable String workerType, @RequestBody JsonNode template)
      throws IOException {
    elementTemplateService.save(workerType, template);
  }
}
