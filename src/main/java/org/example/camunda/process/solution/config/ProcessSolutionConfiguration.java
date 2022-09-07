package org.example.camunda.process.solution.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "process.solution")
public class ProcessSolutionConfiguration {

  private String allowedOriginPatterns;

  public String getAllowedOriginPatterns() {
    return allowedOriginPatterns;
  }

  public void setAllowedOriginPatterns(String allowedOriginPatterns) {
    this.allowedOriginPatterns = allowedOriginPatterns;
  }
}
