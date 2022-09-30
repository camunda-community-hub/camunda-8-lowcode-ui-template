package org.example.camunda.process.solution.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
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
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class BpmnUtils {
  private static final Logger LOG = LoggerFactory.getLogger(BpmnUtils.class);

  private static Map<String, String> bpmnEmbeddedFormSchema = new HashMap<String, String>();
  private static Map<String, String> activityNameFromSchema = new HashMap<String, String>();
  private static Map<String, String> processNames = new HashMap<String, String>();

  private BpmnUtils() {}

  private static Node getNodeFromBpmnFile(String xml, String nodeId) {
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

  public static String getProcessName(String xml, String bpmnProcessId) {
    // if reading from the local BPMN file, it can't change. So lets read it only once.
    if (processNames.containsKey(xml + bpmnProcessId)) {
      return processNames.get(xml + bpmnProcessId);
    }
    String processName = bpmnProcessId;
    Node processNode = getNodeFromBpmnFile(xml, bpmnProcessId);
    if (processNode != null) {
      processName = processNode.getAttributes().getNamedItem("name").getNodeValue();
    }
    processNames.put(xml + bpmnProcessId, processName);
    return processName;
  }

  public static String getTaskNameFromBpmn(String xml, String activityId) {
    // if reading from the local BPMN file, it can't change. So lets read it only once.
    if (activityNameFromSchema.containsKey(xml + activityId)) {
      return activityNameFromSchema.get(xml + activityId);
    }
    String taskName = activityId;
    Node taskNode = getNodeFromBpmnFile(xml, activityId);
    if (taskNode != null) {
      taskName = taskNode.getAttributes().getNamedItem("name").getNodeValue();
    }
    activityNameFromSchema.put(xml + activityId, taskName);
    return taskName;
  }

  public static String getFormSchemaFromBpmnFile(String xml, String formId) {
    // if reading from the local BPMN file, it can't change. So lets read it only once.
    if (bpmnEmbeddedFormSchema.containsKey(xml + formId)) {
      return bpmnEmbeddedFormSchema.get(xml + formId);
    }
    String schema = null;
    Node formNode = getNodeFromBpmnFile(xml, formId);
    if (formNode != null) {
      schema = formNode.getFirstChild().getNodeValue();
    }
    bpmnEmbeddedFormSchema.put(xml + formId, schema);
    return schema;
  }
}
