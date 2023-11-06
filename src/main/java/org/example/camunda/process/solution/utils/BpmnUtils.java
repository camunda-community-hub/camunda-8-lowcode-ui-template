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
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class BpmnUtils {

  private BpmnUtils() {}

  private static final Logger LOG = LoggerFactory.getLogger(BpmnUtils.class);

  private static Node getNodeFromBpmnFile(String bpmnFileName, String nodeId) {
    InputStream bpmnIs =
        BpmnUtils.class.getClassLoader().getResourceAsStream("models/" + bpmnFileName);
    return getNodeFromBpmn(bpmnIs, nodeId);
  }

  private static Node getNodeFromBpmn(String xml, String nodeId) {
    return getNodeFromBpmn(
        new ByteArrayInputStream(xml.getBytes(Charset.forName("UTF-8"))), nodeId);
  }

  private static Node getNodeFromBpmn(InputStream bpmnInputStream, String nodeId) {
    try {
      DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
      DocumentBuilder builder = builderFactory.newDocumentBuilder();

      Document xmlDocument = builder.parse(bpmnInputStream);
      return getNodeFromDocument(xmlDocument, nodeId);
    } catch (IOException
        | XPathExpressionException
        | SAXException
        | ParserConfigurationException e) {
      LOG.error("Error reading the requested node id " + nodeId, e);
    }
    return null;
  }

  private static Node getNodeFromDocument(Document xmlDocument, String nodeId)
      throws XPathExpressionException {

    XPath xPath = XPathFactory.newInstance().newXPath();
    String expression = "//*[@id=\"" + nodeId + "\"]";
    NodeList nodeList =
        (NodeList) xPath.compile(expression).evaluate(xmlDocument, XPathConstants.NODESET);
    if (nodeList != null && nodeList.getLength() == 1) {
      return nodeList.item(0);
    }
    return null;
  }

  public static String getProcessName(String xml, String bpmnProcessId) {
    LOG.info("get ProcessName for " + bpmnProcessId);
    String processName = bpmnProcessId;
    Node processNode = getNodeFromBpmn(xml, bpmnProcessId);
    if (processNode != null) {
      processName = processNode.getAttributes().getNamedItem("name").getNodeValue();
    }
    return processName;
  }

  public static String getTaskNameFromBpmn(String xml, String activityId) {
    LOG.info("get TaskName for " + activityId);
    String taskName = activityId;
    Node taskNode = getNodeFromBpmn(xml, activityId);
    if (taskNode != null) {
      taskName = taskNode.getAttributes().getNamedItem("name").getNodeValue();
    }
    return taskName;
  }

  public static String getFormSchemaFromBpmn(String xml, String formId) {
    LOG.info("get TaskName for " + formId);
    String schema = null;
    Node formNode = getNodeFromBpmn(xml, formId);
    if (formNode != null) {
      schema = formNode.getFirstChild().getNodeValue();
    }
    return schema;
  }

  public static String getProcessNameFromFile(String bpmnFileName, String bpmnProcessId) {
    String processName = bpmnProcessId;
    Node processNode = getNodeFromBpmnFile(bpmnFileName, bpmnProcessId);
    if (processNode != null) {
      processName = processNode.getAttributes().getNamedItem("name").getNodeValue();
    }
    return processName;
  }

  public static String getTaskNameFromFile(String bpmnFileName, String activityId) {
    String taskName = activityId;
    Node taskNode = getNodeFromBpmnFile(bpmnFileName, activityId);
    if (taskNode != null) {
      taskName = taskNode.getAttributes().getNamedItem("name").getNodeValue();
    }
    return taskName;
  }

  public static String getFormSchemaFromFile(String bpmnFileName, String formId) {
    String schema = null;
    Node formNode = getNodeFromBpmnFile(bpmnFileName, formId);
    if (formNode != null) {
      schema = formNode.getFirstChild().getNodeValue();
    }
    return schema;
  }

  public static String getStartingFormSchema(String xml) {
    return getStartingFormSchema(new ByteArrayInputStream(xml.getBytes(Charset.forName("UTF-8"))));
  }

  private static String getStartingFormSchema(InputStream bpmnInputStream) {
    try {
      DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
      DocumentBuilder builder = builderFactory.newDocumentBuilder();

      Document xmlDocument = builder.parse(bpmnInputStream);

      String formKey = getStartingFormKey(xmlDocument);
      if (formKey != null) {
        String formId = formKey.substring(formKey.lastIndexOf(":") + 1);
        Node formNode = getNodeFromDocument(xmlDocument, formId);
        if (formNode != null) {
          return formNode.getFirstChild().getNodeValue();
        }
      }
    } catch (IOException
        | SAXException
        | ParserConfigurationException
        | XPathExpressionException e) {
      LOG.error("Error reading the starting event", e);
    }
    return null;
  }

  private static String getStartingFormKey(Document xmlDocument) {
    NodeList nodeList = xmlDocument.getElementsByTagName("bpmn:startEvent");

    if (nodeList != null && nodeList.getLength() == 1) {
      Node startEvent = nodeList.item(0);
      if (startEvent instanceof Element) {
        NodeList formDefs = ((Element) startEvent).getElementsByTagName("zeebe:formDefinition");
        if (formDefs != null && formDefs.getLength() == 1) {
          return formDefs.item(0).getAttributes().getNamedItem("formKey").getNodeValue();
        }
      }
    }
    return null;
  }
}
