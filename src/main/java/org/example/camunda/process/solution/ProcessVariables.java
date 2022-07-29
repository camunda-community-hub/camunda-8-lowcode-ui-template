package org.example.camunda.process.solution;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import org.apache.commons.lang3.builder.MultilineRecursiveToStringStyle;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@JsonInclude(Include.NON_NULL)
public class ProcessVariables {

  private String texte;
  private Long number;
  private String date;

  public String getTexte() {
    return texte;
  }

  public ProcessVariables setTexte(String texte) {
    this.texte = texte;
    return this;
  }

  public Long getNumber() {
    return number;
  }

  public ProcessVariables setNumber(Long number) {
    this.number = number;
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
