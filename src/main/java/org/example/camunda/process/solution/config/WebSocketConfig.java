package org.example.camunda.process.solution.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Autowired ProcessSolutionConfiguration processSolutionConfiguration;

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/topic");
    config.setApplicationDestinationPrefixes("/app");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    String allowedOriginPatterns = processSolutionConfiguration.getAllowedOriginPatterns();
    registry.addEndpoint("/ws").setAllowedOriginPatterns(allowedOriginPatterns);
    registry.addEndpoint("/ws").setAllowedOriginPatterns(allowedOriginPatterns).withSockJS();
  }
}
