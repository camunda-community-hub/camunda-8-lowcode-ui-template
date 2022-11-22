package org.example.camunda.process.solution.facade;

import java.util.Map;
import org.camunda.feel.FeelEngine;
import org.camunda.feel.impl.SpiServiceLoader;
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

  @IsAuthenticated
  @PostMapping("/test")
  public Object feelTest(@RequestBody Map<String, Object> feelTest) {

    final Either<FeelEngine.Failure, Object> result =
        feelEngine.evalExpression(
            (String) feelTest.get("expression"), (Map<String, Object>) feelTest.get("context"));
    if (result.isRight()) {
      return result.right().get();
    } else {
      return result.left().get().message();
    }
  }

  @Override
  public Logger getLogger() {
    return logger;
  }
}
