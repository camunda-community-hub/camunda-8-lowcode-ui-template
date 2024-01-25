package org.example.camunda.process.solution.facade;

import io.camunda.tasklist.exception.TaskListException;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.example.camunda.process.solution.jsonmodel.Theme;
import org.example.camunda.process.solution.security.annotation.IsEditor;
import org.example.camunda.process.solution.service.ThemeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
  public Set<String> themeNames() {
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

  @IsEditor
  @PostMapping(
      value = "logo",
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
      produces = MediaType.APPLICATION_JSON_VALUE)
  public Theme uploadLogo(@RequestPart("file") List<MultipartFile> uploadedfiles)
      throws IOException {
    if (uploadedfiles.size() > 0) {
      MultipartFile file = uploadedfiles.get(0);
      themeService.addLogo(file);
    }
    return themeService.getActiveTheme();
  }

  @IsEditor
  @GetMapping("logos")
  public List<String> listLogos() {
    return themeService.listLogos();
  }

  @IsEditor
  @PostMapping(
      value = "bg",
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
      produces = MediaType.APPLICATION_JSON_VALUE)
  public Theme uploadBg(@RequestPart("file") List<MultipartFile> uploadedfiles) throws IOException {
    if (uploadedfiles.size() > 0) {
      MultipartFile file = uploadedfiles.get(0);
      themeService.addBg(file);
    }
    return themeService.getActiveTheme();
  }

  @IsEditor
  @GetMapping("bgs")
  public List<String> listBgs() {
    return themeService.listBgs();
  }

  @RequestMapping(value = "/current", method = RequestMethod.GET)
  public ResponseEntity<Void> css(HttpServletResponse response) throws IOException {

    // Set the content-type
    response.setHeader("Content-Type", "text/css");

    String css = themeService.getActiveTheme().getImgs(getServerHost(), "/api/themes/file");
    css += themeService.getActiveTheme().getColors();
    css += themeService.getActiveTheme().getContent();

    response.getOutputStream().write(css.getBytes(Charset.forName("UTF-8")));

    response.flushBuffer();

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

  @GetMapping("file/{fileType}/{fileName}")
  @ResponseBody
  public ResponseEntity<Resource> serveFile(
      @PathVariable String fileType, @PathVariable String fileName) throws IOException {
    File file = null;
    if (fileType.equals("logo")) {
      file = themeService.resolveLogo(fileName);
    } else {
      file = themeService.resolveBg(fileName);
    }

    // HttpHeaders header = new HttpHeaders();
    // header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
    // header.add("Cache-Control", "no-cache, no-store, must-revalidate");
    // header.add("Pragma", "no-cache");
    // header.add("Expires", "0");

    Path path = Paths.get(file.getAbsolutePath());
    ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

    return ResponseEntity.ok()
        .contentType(MediaType.valueOf(Files.probeContentType(file.toPath())))
        .contentLength(file.length())
        .body(resource);
  }
}
