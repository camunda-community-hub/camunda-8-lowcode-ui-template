package org.example.camunda.process.solution.facade;

import com.fasterxml.jackson.core.type.TypeReference;
import io.camunda.operate.exception.OperateException;
import io.camunda.zeebe.client.ZeebeClient;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.example.camunda.process.solution.security.annotation.IsAuthenticated;
import org.example.camunda.process.solution.service.OperateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/comments")
public class CommentsController extends AbstractController {

  public static final String COMMENTS_KEY = "instance_comments";

  private static final Logger LOG = LoggerFactory.getLogger(CommentsController.class);
  private final ZeebeClient zeebeClient;
  private final OperateService operateService;

  public CommentsController(ZeebeClient client, OperateService operateService) {
    this.zeebeClient = client;
    this.operateService = operateService;
  }

  @IsAuthenticated
  @GetMapping("/{processInstanceKey}")
  public List<Map<String, String>> getComments(@PathVariable Long processInstanceKey)
      throws OperateException {

    List<Map<String, String>> list =
        this.operateService.getVariable(
            processInstanceKey, COMMENTS_KEY, new TypeReference<List<Map<String, String>>>() {});
    if (list != null) {
      return list;
    }
    return new ArrayList<>();
  }

  @IsAuthenticated
  @PostMapping("/{processInstanceKey}")
  public List<Map<String, String>> addComment(
      @PathVariable Long processInstanceKey, @RequestBody Map<String, String> comment)
      throws OperateException {
    List<Map<String, String>> comments = getComments(processInstanceKey);
    List<Map<String, String>> newComments = new ArrayList<>();
    newComments.add(
        Map.of(
            "author",
            getAuthenticatedUsername(),
            "comment",
            comment.get("content"),
            "date",
            LocalDateTime.now().toString().replace("T", " ").substring(0, 19)));
    if (comments != null) {
      newComments.addAll(comments);
    }
    this.zeebeClient
        .newSetVariablesCommand(processInstanceKey)
        .variables(Map.of(COMMENTS_KEY, newComments))
        .send()
        .join();
    return newComments;
  }

  @Override
  public Logger getLogger() {
    return LOG;
  }
}
