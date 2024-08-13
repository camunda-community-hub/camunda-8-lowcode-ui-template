package org.example.camunda.process.solution.utils;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.math.NumberUtils;
import org.camunda.feel.FeelEngine;
import org.camunda.feel.FeelEngineClock;
import org.camunda.feel.impl.SpiServiceLoader;
import org.camunda.feel.syntaxtree.Val;
import org.camunda.feel.syntaxtree.ValDayTimeDuration;
import scala.util.Either;

public class FeelUtils {

  private static Long estimatedClock;

  private static FeelEngine engine =
      new FeelEngine.Builder()
          .valueMapper(SpiServiceLoader.loadValueMapper())
          .functionProvider(SpiServiceLoader.loadFunctionProvider())
          .clock(
              new FeelEngineClock() {

                @Override
                public ZonedDateTime getCurrentTime() {
                  return Instant.ofEpochMilli(estimatedClock).atZone(ZoneId.systemDefault());
                }
              })
          .build();

  public static void setClock(long time) {
    estimatedClock = time;
  }

  public static <T extends Val> T evaluate(String expression, Class<T> expectedType) {
    return evaluate(expression, new HashMap<>(), expectedType);
  }

  public static Object evaluate(String expression, Map<String, Object> context) {
    if (estimatedClock == null) {
      estimatedClock = System.currentTimeMillis();
    }
    final Either<FeelEngine.Failure, Object> result = engine.evalExpression(expression, context);
    if (result.isLeft()) {
      return result.left().get().message();
    }
    return result.getOrElse(null);
  }

  public static <T extends Val> T evaluate(
      String expression, Map<String, Object> context, Class<T> expectedType) {
    return (T) evaluate(expression, context);
  }

  public static Long feelDurationToMillis(String duration) {
    if (NumberUtils.isCreatable(duration)) {
      // expression is in millis
      return Long.valueOf(duration);
    }
    if (duration.startsWith("P")) {
      duration = "duration(\"" + duration + "\")";
    }
    return evaluate(duration, ValDayTimeDuration.class).value().toMillis();
  }
}
