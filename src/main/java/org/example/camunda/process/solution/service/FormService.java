package org.example.camunda.process.solution.service;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.example.camunda.process.solution.facade.dto.Form;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FormService {

  public static final String FORMS = "forms";

  @Value("${workspace:workspace}")
  private String workspace;

  public Path resolveForm(String name) {
    return Path.of(workspace).resolve(FORMS).resolve(name);
  }

  public List<String> findNames() {
    return Stream.of(Path.of(workspace).resolve(FORMS).toFile().listFiles())
        .map(File::getName)
        .collect(Collectors.toList());
  }

  public Form findByName(String name) throws StreamReadException, DatabindException, IOException {
    return JsonUtils.fromJsonFile(resolveForm(name), Form.class);
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
