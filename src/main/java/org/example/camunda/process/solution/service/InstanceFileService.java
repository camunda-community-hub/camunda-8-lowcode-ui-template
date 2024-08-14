package org.example.camunda.process.solution.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class InstanceFileService {

  public static final String DOCS = "docs";

  @Value("${workspace:workspace}")
  private String workspace;

  private Path resolveParent(String processInstanceKey, String type) {
    Path parent = Path.of(workspace).resolve(DOCS).resolve(processInstanceKey).resolve(type);
    File pf = parent.toFile();
    if (!pf.exists()) {
      pf.mkdirs();
    }
    return parent;
  }

  public Map<String, Object> handleFiles(Map<String, Object> variables, List<MultipartFile> files)
      throws IOException {

    variables.put("uploaded", OffsetDateTime.now());
    if (files != null && files.size() > 0) {
      for (int i = 0; i < files.size(); i++) {
        MultipartFile file = files.get(i);
        File tempFile =
            resolveParent(
                    (String) variables.get("processInstanceKey"), (String) variables.get("type"))
                .resolve(file.getOriginalFilename())
                .toFile();
        try (FileOutputStream out = new FileOutputStream(tempFile)) {
          IOUtils.copy(file.getInputStream(), out);
        }
        variables.put("filename", file.getOriginalFilename());
        variables.put("uploaded", Boolean.TRUE);
      }
    }
    return variables;
  }

  public Path getPath(String processInstanceKey, String type, String name) {
    return resolveParent(processInstanceKey, type).resolve(name);
  }
}
