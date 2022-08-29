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
import org.example.camunda.process.solution.facade.dto.MailTemplate;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MailTemplateService {

  public static final String MAILS = "mails";

  @Value("${workspace:workspace}")
  private String workspace;

  public Path resolveMail(String name) {
    return Path.of(workspace).resolve(MAILS).resolve(name);
  }

  public List<String> findNames() {
    return Stream.of(Path.of(workspace).resolve(MAILS).toFile().listFiles())
        .map(File::getName)
        .collect(Collectors.toList());
  }

  public MailTemplate findByName(String name)
      throws StreamReadException, DatabindException, IOException {
    return JsonUtils.fromJsonFile(resolveMail(name), MailTemplate.class);
  }

  public MailTemplate saveMail(MailTemplate template) throws IOException {
    template.setModified(new Date());
    JsonUtils.toJsonFile(resolveMail(template.getName()), template);
    return template;
  }

  public void deleteByName(String name) throws IOException {
    Files.delete(resolveMail(name));
  }
}
