package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.module.scala.DefaultScalaModule;
import java.util.Map;
import org.camunda.feel.FeelEngine;
import org.camunda.feel.FeelEngine.Failure;
import org.camunda.feel.impl.SpiServiceLoader;
import org.camunda.feel.syntaxtree.ParsedExpression;
import org.camunda.feel.syntaxtree.Val;
import org.camunda.feel.valuemapper.ValueMapper;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import scala.util.Either;

@CrossOrigin
@RestController
@RequestMapping("/api/feel")
public class FeelTestController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(FeelTestController.class);

  private FeelEngine feelEngine =
      new FeelEngine.Builder()
          .valueMapper(SpiServiceLoader.loadValueMapper())
          .functionProvider(SpiServiceLoader.loadFunctionProvider())
          .build();

  private ObjectMapper scalaMapper;

  private ValueMapper getValueMapper() {
    return feelEngine.defaultValueMapper();
  }

  private ObjectMapper getScalaMapper() {
    if (scalaMapper == null) {
      scalaMapper = new ObjectMapper();
      scalaMapper.registerModule(new DefaultScalaModule());
    }
    return scalaMapper;
  }

  private String getJsonValue(Val val) throws JsonProcessingException {
    return getScalaMapper().writeValueAsString(getValueMapper().unpackVal(val));
  }

  @IsAuthenticated
  @PostMapping("/test")
  public String feelTest(@RequestBody Map<String, Object> feelTest) throws JsonProcessingException {
    final Either<Failure, ParsedExpression> parseResult =
        feelEngine.parseExpression((String) feelTest.get("expression"));
    if (parseResult.isLeft()) {
      Failure failure = parseResult.left().get();
      return failure.message();
    } else {
      ParsedExpression parsedExpression = parseResult.right().get();
      Either<Failure, Object> evalResult =
          feelEngine.eval(parsedExpression, (Map<String, Object>) feelTest.get("context"));
      if (evalResult.isRight()) {
        return getJsonValue((Val) evalResult.right().get());
      } else {
        return evalResult.left().get().message();
      }
    }
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
