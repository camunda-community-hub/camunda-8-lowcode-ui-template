package org.example.camunda.process.solution.facade;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.example.camunda.process.solution.facade.dto.FileHolder;
import org.example.camunda.process.solution.service.InstanceFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin
@RestController
@RequestMapping("/api/file")
public class FileController {

  public static final String SUFFIX = ".tmp";

  Map<String, FileHolder> files = new HashMap<>();

  @Autowired InstanceFileService instanceFileService;

  @PostMapping(
      value = "upload",
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
      produces = MediaType.APPLICATION_JSON_VALUE)
  public FileHolder upload(@RequestPart("File") List<MultipartFile> uploadedfiles)
      throws IOException {
    if (uploadedfiles.size() > 0) {
      MultipartFile file = uploadedfiles.get(0);
      File tempFile = File.createTempFile(file.getOriginalFilename(), SUFFIX);
      try (FileOutputStream out = new FileOutputStream(tempFile)) {
        IOUtils.copy(file.getInputStream(), out);
      }

      FileHolder fileHolder =
          new FileHolder()
              .setName(file.getOriginalFilename())
              .setPath(tempFile.toPath())
              .setReference("ref" + files.size())
              .setContentType(file.getContentType());
      files.put(fileHolder.getReference(), fileHolder);
      return fileHolder;
    }
    return null;
  }

  @PostMapping(
      value = "docUpload",
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
      produces = MediaType.APPLICATION_JSON_VALUE)
  public Map<String, Object> upload(
      @RequestPart("body") Map<String, Object> variables,
      @RequestPart(name = "files", required = false) List<MultipartFile> files)
      throws IOException {

    return instanceFileService.handleFiles(variables, files);
  }

  @GetMapping("serve/{fileReference}")
  @ResponseBody
  public ResponseEntity<Resource> serveFile(@PathVariable String fileReference) throws IOException {
    FileHolder fileHolder = files.get(fileReference);
    File file = fileHolder.getPath().toFile();

    HttpHeaders header = new HttpHeaders();
    header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileHolder.getName());
    header.add("Cache-Control", "no-cache, no-store, must-revalidate");
    header.add("Pragma", "no-cache");
    header.add("Expires", "0");

    Path path = Paths.get(file.getAbsolutePath());
    ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

    return ResponseEntity.ok()
        .contentType(MediaType.valueOf(fileHolder.getContentType()))
        .contentLength(file.length())
        .body(resource);
  }
}
