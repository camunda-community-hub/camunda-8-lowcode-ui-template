package org.example.camunda.process.solution.service;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.example.camunda.process.solution.facade.dto.Form;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

@Service
public class FormService {

  public static final String FORMS = "forms";

  @Value("${workspace:workspace}")
  private String workspace;

  public String parseFormIdFromKey(String formKey) {
    Pattern pattern = Pattern.compile("[^:]+:[^:]+:(.*)");
    Matcher matcher = pattern.matcher(formKey);
    while (matcher.find()) {
      return matcher.group(1);
    }
    return null;
  }

  public String getFormSchemaFromBpmn(String bpmnFileName, String formId)
      throws IOException, ParserConfigurationException, SAXException, XPathExpressionException {
    DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
    DocumentBuilder builder = builderFactory.newDocumentBuilder();
    // TODO: this is used by the reactjs app. Need to integrate this
    InputStream bpmnIs =
        this.getClass().getClassLoader().getResourceAsStream("models/" + bpmnFileName);
    Document xmlDocument = builder.parse(bpmnIs);
    XPath xPath = XPathFactory.newInstance().newXPath();
    String expression = "//*[@id=\"" + formId + "\"]";
    NodeList nodeList =
        (NodeList) xPath.compile(expression).evaluate(xmlDocument, XPathConstants.NODESET);
    if (nodeList != null && nodeList.getLength() == 1) {
      return nodeList.item(0).getFirstChild().getNodeValue();
    } else {
      throw new IllegalStateException("Unable to find json schema for form with name " + formId);
    }
  }

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
