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
import org.example.camunda.process.solution.model.User;
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

  @Autowired private UserService userService;

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

  public boolean checkEmpty() {
    return userService.count() == 0;
  }

  private void initUsers() {
    if (checkEmpty()) {
      userService.create(
          new User("christophe", "pwd")
              .setFirstname("Christophe")
              .setLastname("Dame")
              .setEmail("christophe.dame@camunda.com"));
      userService.create(
          new User("falko", "pwd")
              .setFirstname("Falko")
              .setLastname("Menge")
              .setEmail("falko.menge@camunda.com"));
      userService.create(
          new User("marco", "pwd")
              .setFirstname("Marco")
              .setLastname("Dame")
              .setEmail("marco.lopes@camunda.com"));
      userService.create(
          new User("thomas", "pwd")
              .setFirstname("Thomas")
              .setLastname("Gütt")
              .setEmail("thomas.gutt@camunda.com"));
      userService.create(
          new User("fatma", "pwd")
              .setFirstname("Fatma")
              .setLastname("Cheour")
              .setEmail("fatma.cheour@camunda.com"));
    }
  }

  @PostConstruct
  private void init() throws IOException {
    createWorkspace();
    initGoogle();
    initThymeleaf();
    initUsers();
  }
}
