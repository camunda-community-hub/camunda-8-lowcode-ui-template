package org.example.camunda.process.solution.security.basic;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@ConditionalOnProperty(
    name = "spring.security.oauth2.enabled",
    havingValue = "false",
    matchIfMissing = true)
@EnableMethodSecurity(prePostEnabled = true)
public class JwtSecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf()
        .disable()
        .formLogin()
        .disable()
        .cors()
        .and()
        .addFilterAfter(new JwtAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
        .authorizeRequests()
        .requestMatchers("/")
        .permitAll();
    http.headers().frameOptions().disable();
    return http.build();
  }
}
