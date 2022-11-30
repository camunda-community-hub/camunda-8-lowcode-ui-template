package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.camunda.tasklist.exception.TaskListException;
import io.camunda.zeebe.dmn.DecisionContext;
import io.camunda.zeebe.dmn.DecisionEvaluationResult;
import io.camunda.zeebe.dmn.ParsedDecisionRequirementsGraph;
import io.camunda.zeebe.dmn.impl.DmnScalaDecisionEngine;
import io.camunda.zeebe.dmn.impl.VariablesContext;
import io.camunda.zeebe.protocol.impl.encoding.MsgPackConverter;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.jsonmodel.Dmn;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
import org.example.camunda.process.solution.security.annotation.IsEditor;
import org.example.camunda.process.solution.service.DmnService;
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
@RequestMapping("/api/dmn")
public class DmnController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(DmnController.class);

  private DmnScalaDecisionEngine dmnEngine = new DmnScalaDecisionEngine();

  @Autowired private DmnService dmnService;

  @IsEditor
  @PostMapping
  public ResponseEntity<Dmn> save(@RequestBody Dmn dmn) throws IOException {
    dmnService.save(dmn);
    return new ResponseEntity<>(dmn, HttpStatus.CREATED);
  }

  @IsEditor
  @GetMapping("/{name}")
  @ResponseBody
  public Dmn getDmn(@PathVariable String name) throws TaskListException, IOException {
    return dmnService.findByName(name);
  }

  @IsEditor
  @DeleteMapping("/{name}")
  public void delete(@PathVariable String name) throws TaskListException, IOException {
    dmnService.deleteByName(name);
  }

  @IsEditor
  @GetMapping(value = "/names")
  @ResponseBody
  public List<String> formNames() {
    return dmnService.findNames();
  }

  @IsAuthenticated
  @PostMapping("/test")
  public String dmnTest(@RequestBody Dmn dmn) throws IOException {
    InputStream inputStream = new ByteArrayInputStream(dmn.getDefinition().getBytes());
    // this.getClass().getClassLoader().getResourceAsStream("models/diagram_1.dmn");
    ParsedDecisionRequirementsGraph parsedDrg = dmnEngine.parse(inputStream);
    Map<String, Object> contextAsMap =
        new ObjectMapper()
            .convertValue(dmn.getContextData(), new TypeReference<Map<String, Object>>() {});
    DecisionContext context = new VariablesContext(contextAsMap);
    DecisionEvaluationResult result =
        dmnEngine.evaluateDecisionById(parsedDrg, dmn.getDecisionId(), context);
    if (result.isFailure()) {
      return result.getFailureMessage();
    }
    return MsgPackConverter.convertToJson(result.getOutput());
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
