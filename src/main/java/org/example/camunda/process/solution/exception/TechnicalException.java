package org.example.camunda.process.solution.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class TechnicalException extends RuntimeException {

  /** */
  private static final long serialVersionUID = -7593616210087047797L;

  public TechnicalException() {
    super();
  }

  public TechnicalException(Exception e) {
    super(e);
  }

  public TechnicalException(String message) {
    super(message);
  }

  public TechnicalException(String message, Exception e) {
    super(message, e);
  }
}
