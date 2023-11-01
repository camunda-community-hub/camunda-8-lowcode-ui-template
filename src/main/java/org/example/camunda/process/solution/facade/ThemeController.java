package org.example.camunda.process.solution.facade;

import io.camunda.tasklist.rest.exception.TaskListException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.example.camunda.process.solution.jsonmodel.Theme;
import org.example.camunda.process.solution.security.annotation.IsEditor;
import org.example.camunda.process.solution.service.ThemeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/themes")
public class ThemeController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(ThemeController.class);

  @Autowired private ThemeService themeService;

  @IsEditor
  @PostMapping
  public ResponseEntity<Theme> save(@RequestBody Theme theme) throws IOException {
    themeService.saveTheme(theme);
    return new ResponseEntity<>(theme, HttpStatus.CREATED);
  }

  @IsEditor
  @GetMapping("/{templateName}")
  @ResponseBody
  public Theme getTheme(@PathVariable String templateName) throws TaskListException, IOException {
    return themeService.findByName(templateName);
  }

  @IsEditor
  @DeleteMapping("/{templateName}")
  public void delete(@PathVariable String templateName) throws TaskListException, IOException {
    themeService.deleteByName(templateName);
  }

  @IsEditor
  @GetMapping(value = "/names")
  @ResponseBody
  public List<String> themeNames() {
    return themeService.findNames();
  }

  @Override
  public Logger getLogger() {
    return logger;
  }

  @RequestMapping(value = "/generate", method = RequestMethod.POST)
  public String generate(@RequestBody Map<String, String> variables) throws IOException {
    return themeService.generateCss(variables);
  }

  @IsEditor
  @PostMapping("/active/{themeName}")
  public Theme setActive(@PathVariable String themeName) throws IOException {
    return themeService.activate(themeName, true);
  }

  @RequestMapping(value = "/current", method = RequestMethod.GET)
  public ResponseEntity<Void> css(HttpServletResponse response) throws IOException {

    // Set the content-type
    response.setHeader("Content-Type", "text/css");

    String css = themeService.getActiveTheme().getContent();

    response.getOutputStream().write(css.getBytes(Charset.forName("UTF-8")));

    response.flushBuffer();

    return new ResponseEntity<Void>(HttpStatus.OK);
  }
}
