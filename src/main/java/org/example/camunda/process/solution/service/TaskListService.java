package org.example.camunda.process.solution.service;

import io.camunda.tasklist.CamundaTaskListClient;
import io.camunda.tasklist.auth.LocalIdentityAuthentication;
import io.camunda.tasklist.auth.SaasAuthentication;
import io.camunda.tasklist.dto.Form;
import io.camunda.tasklist.dto.TaskState;
import io.camunda.tasklist.dto.Variable;
import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.example.camunda.process.solution.dao.TaskTokenRepository;
import org.example.camunda.process.solution.facade.dto.Task;
import org.example.camunda.process.solution.model.TaskToken;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

@Service
public class TaskListService {

  @Value("${baseUrl}")
  private String baseUrl;

  @Value("${zeebe.client.cloud.client-id:notProvided}")
  private String clientId;

  @Value("${zeebe.client.cloud.client-secret:notProvided}")
  private String clientSecret;

  @Value("${zeebe.client.cloud.clusterId:notProvided}")
  private String clusterId;

  @Value("${zeebe.client.cloud.region:notProvided}")
  private String region;

  @Value("${identity.clientId:notProvided}")
  private String identityClientId;

  @Value("${identity.clientSecret:notProvided}")
  private String identityClientSecret;

  @Value("${tasklistUrl:notProvided}")
  private String tasklistUrl;

  private CamundaTaskListClient client;

  @Autowired private TaskTokenRepository taskTokenRepository;

  private CamundaTaskListClient getCamundaTaskListClient() throws TaskListException {
    if (client == null) {
      if (!"notProvided".equals(clientId)) {
        SaasAuthentication sa = new SaasAuthentication(clientId, clientSecret);
        client =
            new CamundaTaskListClient.Builder()
                .shouldReturnVariables()
                .taskListUrl("https://" + region + ".tasklist.camunda.io/" + clusterId)
                .authentication(sa)
                .build();
      } else {
        LocalIdentityAuthentication la =
            new LocalIdentityAuthentication()
                .clientId(identityClientId)
                .clientSecret(identityClientSecret);
        client =
            new CamundaTaskListClient.Builder()
                .shouldReturnVariables()
                .taskListUrl(tasklistUrl)
                .authentication(la)
                .build();
      }
    }
    return client;
  }

  public Task claim(String taskId, String assignee) throws TaskListException {
    return convert(getCamundaTaskListClient().claim(taskId, assignee));
  }

  public Task unclaim(String taskId) throws TaskListException {
    return convert(getCamundaTaskListClient().unclaim(taskId));
  }

  public Task getTask(String taskId) throws TaskListException {
    return convert(getCamundaTaskListClient().getTask(taskId));
  }

  public List<Task> getGroupTasks(String group, TaskState state, Integer pageSize)
      throws TaskListException {
    return convert(getCamundaTaskListClient().getGroupTasks(group, state, pageSize));
  }

  public List<Task> getAssigneeTasks(String assignee, TaskState state, Integer pageSize)
      throws TaskListException {
    return convert(getCamundaTaskListClient().getAssigneeTasks(assignee, state, pageSize));
  }

  public List<Task> getTasks(TaskState state, Integer pageSize) throws TaskListException {
    return convert(getCamundaTaskListClient().getTasks(null, state, pageSize));
  }

  public void completeTask(String taskId, Map<String, Object> variables) throws TaskListException {
    getCamundaTaskListClient().completeTask(taskId, variables);
  }

  public String getForm(String processDefinitionId, String formId) throws TaskListException {
    Form form = getCamundaTaskListClient().getForm(formId, processDefinitionId);
    return form.getSchema();
  }

  private Task convert(io.camunda.tasklist.dto.Task task) {
    Task result = new Task();
    BeanUtils.copyProperties(task, result);
    if (task.getVariables() != null) {
      result.setVariables(new HashMap<>());
      for (Variable var : task.getVariables()) {
        result.getVariables().put(var.getName(), var.getValue());
      }
    }
    String formId = task.getFormKey().substring(task.getFormKey().lastIndexOf(":") + 1);
    try {
      result.setFormSchema(getForm(task.getProcessDefinitionId(), formId));
    } catch (TaskListException e) {
      // unable to set form schema
    }
    return result;
  }

  private List<Task> convert(List<io.camunda.tasklist.dto.Task> tasks) {
    List<Task> result = new ArrayList<>();
    for (io.camunda.tasklist.dto.Task task : tasks) {
      result.add(convert(task));
    }
    return result;
  }

  public String generateLink(String taskId) {
    String token = generateTaskToken(taskId);
    return baseUrl + "/direct-task.html?token=" + token;
  }

  public String generateTaskToken(String taskId) {
    String token = UUID.randomUUID().toString();
    TaskToken taskToken = new TaskToken();
    taskToken.setTaskId(taskId);
    taskToken.setToken(token);
    taskTokenRepository.save(taskToken);
    return token;
  }

  public TaskToken retrieveToken(String token) {
    return taskTokenRepository.findByToken(token);
  }

  public String getTaskNameFromBpmn(String bpmnFileName, String activityId)
      throws IOException, ParserConfigurationException, SAXException, XPathExpressionException {
    DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
    DocumentBuilder builder = builderFactory.newDocumentBuilder();
    // TODO: this is used by the reactjs app. Need to integrate this
    InputStream bpmnIs =
        this.getClass().getClassLoader().getResourceAsStream("models/" + bpmnFileName);
    Document xmlDocument = builder.parse(bpmnIs);
    XPath xPath = XPathFactory.newInstance().newXPath();
    String expression = "//*[@id=\"" + activityId + "\"]";
    NodeList nodeList =
        (NodeList) xPath.compile(expression).evaluate(xmlDocument, XPathConstants.NODESET);
    if (nodeList != null && nodeList.getLength() == 1) {
      return nodeList.item(0).getAttributes().getNamedItem("name").getNodeValue();
    } else {
      throw new IllegalStateException(
          "Unable to find Task Name for Activity with id " + activityId);
    }
  }
}
