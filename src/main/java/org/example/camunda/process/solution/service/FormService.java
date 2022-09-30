package org.example.camunda.process.solution.service;

import io.camunda.tasklist.exception.TaskListException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.example.camunda.process.solution.jsonmodel.Form;
import org.example.camunda.process.solution.utils.BpmnUtils;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FormService {

  public static final String FORMS = "forms";

  /**
   * If true, we are getting the schema from TaskList. if false, we try to read the schema from the
   * local BPMN file.
   */
  @Value("${embeddedForms.fromTasklist:True}")
  private Boolean loadEmbeddedFormsFromTasklist;

  @Value("${workspace:workspace}")
  private String workspace;

  @Autowired private TaskListService tasklistService;

  public Path resolveForm(String name) {
    return Path.of(workspace).resolve(FORMS).resolve(name);
  }

  public List<String> findNames() {
    return Stream.of(Path.of(workspace).resolve(FORMS).toFile().listFiles())
        .map(File::getName)
        .collect(Collectors.toList());
  }

  public Form findByName(String formKey) throws IOException {
    return JsonUtils.fromJsonFile(resolveForm(formKey), Form.class);
  }

  public String getEmbeddedFormSchema(String processName, String processDefinitionId, String formId)
      throws TaskListException {
    if (!loadEmbeddedFormsFromTasklist && processName != null) {
      String schema = BpmnUtils.getFormSchemaFromBpmnFile(processName + ".bpmn", formId);

      if (schema != null) {
        return schema;
      }
    }

    return tasklistService.getForm(processDefinitionId, formId);
  }

  public Form saveForm(Form form) throws IOException {
    form.setModified(new Date());
    JsonUtils.toJsonFile(resolveForm(form.getName()), form);
    return form;
  }

  public void deleteByName(String name) throws IOException {
    Files.delete(resolveForm(name));
  }
}
