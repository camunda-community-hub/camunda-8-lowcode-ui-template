package org.example.camunda.process.solution.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.example.camunda.process.solution.jsonmodel.Dmn;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DmnService {

  public static final String DMNS = "dmns";

  @Value("${workspace:workspace}")
  private String workspace;

  public Path resolve(String name) {
    return Path.of(workspace).resolve(DMNS).resolve(name);
  }

  public List<String> findNames() {
    return Stream.of(Path.of(workspace).resolve(DMNS).toFile().listFiles())
        .map(File::getName)
        .collect(Collectors.toList());
  }

  public Dmn findByName(String formKey) throws IOException {
    return JsonUtils.fromJsonFile(resolve(formKey), Dmn.class);
  }

  public Dmn save(Dmn dmn) throws IOException {
    dmn.setModified(new Date());
    JsonUtils.toJsonFile(resolve(dmn.getName()), dmn);
    return dmn;
  }

  public void deleteByName(String name) throws IOException {
    Files.delete(resolve(name));
  }
}
