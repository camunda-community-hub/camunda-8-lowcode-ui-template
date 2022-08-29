package org.example.camunda.process.solution.service;

import io.camunda.google.GmailUtils;
import io.camunda.google.model.Mail;
import io.camunda.google.thymeleaf.MailBuilderUtils;
import java.io.IOException;
import java.util.Locale;
import java.util.Map;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MailService {

  @Autowired private UserService userService;

  private String getEmail(String username) {
    if (username == null) {
      return null;
    }
    try {
      new InternetAddress(username, true);
      return username;
    } catch (AddressException e) {
      return userService.getUserByUsername(username).getEmail();
    }
  }

  public void sendMail(
      String to,
      String cc,
      String bcc,
      String subject,
      String templateName,
      String locale,
      Map<String, Object> variables)
      throws MessagingException, IOException {
    String htmlBody =
        MailBuilderUtils.buildMailBody(templateName, variables, Locale.forLanguageTag(locale));
    Mail mail =
        new Mail.Builder()
            .to(getEmail(to))
            .bcc(getEmail(bcc))
            .subject(subject)
            .body(htmlBody)
            .build();

    GmailUtils.sendEmail(mail);
  }
}
