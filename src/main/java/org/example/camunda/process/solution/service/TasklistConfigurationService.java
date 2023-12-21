package org.example.camunda.process.solution.service;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Map;
import org.example.camunda.process.solution.jsonmodel.TasklistConf;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TasklistConfigurationService {

  public static final String TASKLIST_CONF = "tasklist.conf";

  @Value("${workspace:workspace}")
  private String workspace;

  public Path resolveConf() {
    return Path.of(workspace).resolve(TASKLIST_CONF);
  }

  public TasklistConf get() throws StreamReadException, DatabindException, IOException {
    return JsonUtils.fromJsonFile(resolveConf(), TasklistConf.class);
  }

  public TasklistConf save(TasklistConf conf) throws IOException {
    JsonUtils.toJsonFile(resolveConf(), conf);
    return conf;
  }

  public TasklistConf defaultTasklistConf() {
    TasklistConf conf = new TasklistConf();
    conf.setSplitPage(true);
    conf.setColumns(new ArrayList<>());
    conf.getColumns()
        .add(Map.of("label", "Id", "value", "id", "type", "number", "showAssignee", "true"));
    conf.getColumns()
        .add(
            Map.of(
                "label", "Task name", "value", "name", "type", "string", "showAssignee", "false"));
    conf.getColumns()
        .add(
            Map.of(
                "label",
                "Process",
                "value",
                "processName",
                "type",
                "string",
                "showAssignee",
                "false"));
    conf.getColumns()
        .add(
            Map.of(
                "label",
                "Date",
                "value",
                "creationDate",
                "type",
                "datetime",
                "showAssignee",
                "false"));
    conf.setDefaultFilters(
        Map.of("state", true, "assigned", true, "assignee", true, "group", true));
    conf.setVariablesFilters(new ArrayList<>());
    return conf;
  }

  @PostConstruct
  private void init() throws IOException {
    if (!resolveConf().toFile().exists()) {
      save(defaultTasklistConf());
    }
  }
}
