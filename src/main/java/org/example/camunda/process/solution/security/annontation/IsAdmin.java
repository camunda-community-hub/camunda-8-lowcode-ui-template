package org.example.camunda.process.solution.security.annontation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.security.access.prepost.PreAuthorize;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Operation(security = {@SecurityRequirement(name = "authorization")})
@PreAuthorize("hasRole('Admin')")
public @interface IsAdmin {}
