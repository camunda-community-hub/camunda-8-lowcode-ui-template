package org.example.camunda.process.solution;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.builder.MultilineRecursiveToStringStyle;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@JsonInclude(Include.NON_NULL)
public class ProcessVariables {

  private String intialMessage;
  private String assignee1;
  private String assignee2;
  private List<Map<String, String>> comments;
  private Map<String, Object> file;
  private String date;

  public String getIntialMessage() {
    return intialMessage;
  }

  public void setIntialMessage(String intialMessage) {
    this.intialMessage = intialMessage;
  }

  public String getAssignee1() {
    return assignee1;
  }

  public ProcessVariables setAssignee1(String assignee1) {
    this.assignee1 = assignee1;
    return this;
  }

  public String getAssignee2() {
    return assignee2;
  }

  public ProcessVariables setAssignee2(String assignee2) {
    this.assignee2 = assignee2;
    return this;
  }

  public List<Map<String, String>> getComments() {
    return comments;
  }

  public ProcessVariables setComments(List<Map<String, String>> comments) {
    this.comments = comments;
    return this;
  }

  public Map<String, Object> getFile() {
    return file;
  }

  public ProcessVariables setFile(Map<String, Object> file) {
    this.file = file;
    return this;
  }

  public String getDate() {
    return date;
  }

  public ProcessVariables setDate(String date) {
    this.date = date;
    return this;
  }

  @Override
  public String toString() {
    return ToStringBuilder.reflectionToString(
        this,
        new MultilineRecursiveToStringStyle() {
          public ToStringStyle withShortPrefixes() {
            this.setUseShortClassName(true);
            this.setUseIdentityHashCode(false);
            return this;
          }
        }.withShortPrefixes());
  }
}
