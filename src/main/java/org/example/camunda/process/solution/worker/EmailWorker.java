package org.example.camunda.process.solution.worker;

import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import io.camunda.zeebe.spring.client.annotation.Variable;
import java.io.IOException;
import java.util.Map;
import javax.mail.MessagingException;
import org.example.camunda.process.solution.ProcessVariables;
import org.example.camunda.process.solution.jsonmodel.User;
import org.example.camunda.process.solution.service.MailService;
import org.example.camunda.process.solution.service.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmailWorker {

  private static final Logger LOG = LoggerFactory.getLogger(EmailWorker.class);

  @Autowired private OrganizationService userService;

  @Autowired private MailService mailService;

  @JobWorker(type = "email", fetchAllVariables = true)
  public ProcessVariables sendEmail(
      ActivatedJob job,
      @Variable String to,
      @Variable String cc,
      @Variable String bcc,
      @Variable String subject,
      @Variable String template,
      @Variable String locale)
      throws MessagingException, IOException {
    LOG.info(
        "Sending email to "
            + to
            + " and bcc "
            + bcc
            + " using template "
            + template
            + " and subject: "
            + subject);

    Map<String, Object> variables = job.getVariablesAsMap();
    User consultant = userService.getUserByUsername(to);
    variables.put("consultant", consultant);

    mailService.sendMail(to, cc, bcc, subject, template, locale, variables);

    return new ProcessVariables();
  }
}
