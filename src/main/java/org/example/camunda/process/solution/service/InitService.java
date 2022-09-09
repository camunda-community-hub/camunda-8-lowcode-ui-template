package org.example.camunda.process.solution.service;

import io.camunda.google.GoogleAuthUtils;
import io.camunda.google.config.GoogleWsConfig;
import io.camunda.google.config.ThymeleafConfig;
import io.camunda.google.thymeleaf.ITemplateResolver;
import io.camunda.google.thymeleaf.MailBuilderUtils;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class InitService {
  private static final Logger LOG = LoggerFactory.getLogger(InitService.class);

  @Value("${workspace:workspace}")
  private String workspace;

  @Autowired private MailTemplateService mailTemplateService;

  public void createWorkspace() throws IOException {
    Path wsPath = Path.of(workspace).toAbsolutePath();
    if (!Files.exists(wsPath, LinkOption.NOFOLLOW_LINKS)) {
      Files.createDirectory(wsPath);
    }
    if (!Files.exists(wsPath.resolve(FormService.FORMS), LinkOption.NOFOLLOW_LINKS)) {
      Files.createDirectory(wsPath.resolve(FormService.FORMS));
    }
    if (!Files.exists(wsPath.resolve(MailTemplateService.MAILS), LinkOption.NOFOLLOW_LINKS)) {
      Files.createDirectory(wsPath.resolve(MailTemplateService.MAILS));
    }
  }

  public void initGoogle() {
    GoogleWsConfig googleWsConfig = new GoogleWsConfig();
    GoogleAuthUtils.configure(googleWsConfig);
  }

  public void initThymeleaf() {
    ThymeleafConfig config = new ThymeleafConfig();
    config.setCustomTemplateResolver(
        new ITemplateResolver() {

          @Override
          public String getTemplateContent(String templateName) {
            try {
              return mailTemplateService.findByName(templateName).getHtmlTemplate();
            } catch (IOException e) {
              LOG.error("Error retrieving mail template", e);
              return null;
            }
          }
        });
    MailBuilderUtils.configure(config);
  }

  @PostConstruct
  private void init() throws IOException {
    createWorkspace();
    initGoogle();
    initThymeleaf();
  }
}
