package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.databind.JsonNode;
import io.camunda.operate.exception.OperateException;
import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import org.example.camunda.process.solution.jsonmodel.TasklistConf;
import org.example.camunda.process.solution.security.annotation.IsEditor;
import org.example.camunda.process.solution.service.OperateService;
import org.example.camunda.process.solution.service.TasklistConfigurationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/tasklistconf")
public class TasklistController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(TasklistController.class);

  @Autowired private TasklistConfigurationService tasklistConfigurationService;
  @Autowired private OperateService operateService;

  @IsEditor
  @PostMapping
  public ResponseEntity<TasklistConf> save(@RequestBody TasklistConf conf) throws IOException {
    tasklistConfigurationService.save(conf);
    return new ResponseEntity<>(conf, HttpStatus.CREATED);
  }

  @GetMapping
  @ResponseBody
  public TasklistConf getConf() throws TaskListException, IOException {
    return tasklistConfigurationService.get();
  }

  @GetMapping("variables")
  public Map<String, Set<JsonNode>> listVariables() throws OperateException, IOException {
    return operateService.listVariables();
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
