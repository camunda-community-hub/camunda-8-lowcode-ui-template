package org.example.camunda.process.solution.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

@Service
@EnableCaching
public class BpmnUtils {
  private static final Logger LOG = LoggerFactory.getLogger(BpmnUtils.class);

  private Node getNodeFromBpmnFile(String xml, String nodeId) {
    try {
      DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
      DocumentBuilder builder = builderFactory.newDocumentBuilder();
      // TODO: this is used by the reactjs app. Need to integrate this
      InputStream bpmnIs = new ByteArrayInputStream(xml.getBytes(Charset.forName("UTF-8")));

      Document xmlDocument = builder.parse(bpmnIs);
      XPath xPath = XPathFactory.newInstance().newXPath();
      String expression = "//*[@id=\"" + nodeId + "\"]";
      NodeList nodeList =
          (NodeList) xPath.compile(expression).evaluate(xmlDocument, XPathConstants.NODESET);
      if (nodeList != null && nodeList.getLength() == 1) {
        return nodeList.item(0);
      }
    } catch (IOException
        | XPathExpressionException
        | SAXException
        | ParserConfigurationException e) {
      LOG.error("Error reading the requested node id " + nodeId + " from " + xml, e);
    }
    return null;
  }

  @Cacheable("ProcessData")
  public String getProcessName(String xml, String bpmnProcessId) {
    LOG.info("get ProcessName for " + bpmnProcessId);
    String processName = bpmnProcessId;
    Node processNode = getNodeFromBpmnFile(xml, bpmnProcessId);
    if (processNode != null) {
      processName = processNode.getAttributes().getNamedItem("name").getNodeValue();
    }
    return processName;
  }

  @Cacheable("ProcessData")
  public String getTaskNameFromBpmn(String xml, String activityId) {
    LOG.info("get TaskName for " + activityId);
    String taskName = activityId;
    Node taskNode = getNodeFromBpmnFile(xml, activityId);
    if (taskNode != null) {
      taskName = taskNode.getAttributes().getNamedItem("name").getNodeValue();
    }
    return taskName;
  }

  @Cacheable("ProcessData")
  public String getFormSchemaFromBpmnFile(String xml, String formId) {
    LOG.info("get TaskName for " + formId);
    String schema = null;
    Node formNode = getNodeFromBpmnFile(xml, formId);
    if (formNode != null) {
      schema = formNode.getFirstChild().getNodeValue();
    }
    return schema;
  }
}
