package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import io.camunda.tasklist.exception.TaskListException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.facade.dto.Language;
import org.example.camunda.process.solution.jsonmodel.Translation;
import org.example.camunda.process.solution.security.annotation.IsEditor;
import org.example.camunda.process.solution.service.InternationalizationService;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/i18n")
public class InternationalizationController {

  @Autowired private InternationalizationService intlService;

  @IsEditor
  @PostMapping
  public ResponseEntity<Translation> save(@RequestBody Translation theme) throws IOException {
    intlService.saveTranslation(theme);
    return new ResponseEntity<>(theme, HttpStatus.CREATED);
  }

  @IsEditor
  @GetMapping("/{languageName}")
  @ResponseBody
  public Translation getTranslation(@PathVariable String languageName)
      throws TaskListException, IOException {
    return intlService.findByName(languageName);
  }

  @IsEditor
  @DeleteMapping("/{languageName}")
  public void delete(@PathVariable String languageName) throws TaskListException, IOException {
    intlService.deleteByName(languageName);
  }

  @GetMapping(value = "/languages")
  @ResponseBody
  public List<Language> languages() {
    Collection<Translation> translations = intlService.all();
    List<Language> languages = new ArrayList<>();
    for (Translation translation : translations) {
      languages.add(new Language(translation.getCode(), translation.getName()));
    }
    return languages;
  }

  @GetMapping("/{ln}/{ns}.json")
  public Map<String, String> translation(@PathVariable String ln)
      throws StreamReadException, DatabindException, IOException {
    return intlService.findByCode(ln).getSiteTranslations();
  }
}
