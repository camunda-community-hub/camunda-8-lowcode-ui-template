package org.example.camunda.process.solution.facade;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin
@RestController
@RequestMapping("/file")
public class FileController {

  public static final String SUFFIX = ".tmp";

  List<File> files = new ArrayList<>();

  @PostMapping(
      value = "upload",
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
      produces = MediaType.APPLICATION_JSON_VALUE)
  public Map<String, Object> upload(@RequestPart("File") List<MultipartFile> uploadedfiles)
      throws IOException {
    if (uploadedfiles.size() > 0) {
      MultipartFile file = uploadedfiles.get(0);
      File tempFile = File.createTempFile(file.getOriginalFilename(), SUFFIX);
      try (FileOutputStream out = new FileOutputStream(tempFile)) {
        IOUtils.copy(file.getInputStream(), out);
      }

      files.add(tempFile);
      return Map.of("reference", files.size() - 1, "name", file.getOriginalFilename());
    }
    return null;
  }
}
