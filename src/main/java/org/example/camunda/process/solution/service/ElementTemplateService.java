package org.example.camunda.process.solution.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.Sets;
import io.camunda.zeebe.spring.client.annotation.JobWorker;
import io.camunda.zeebe.spring.client.annotation.Variable;
import io.camunda.zeebe.spring.client.annotation.VariablesAsType;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.example.camunda.process.solution.facade.dto.WorkerDefinition;
import org.example.camunda.process.solution.utils.JsonUtils;
import org.reflections.Reflections;
import org.reflections.scanners.Scanners;
import org.reflections.util.ConfigurationBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ElementTemplateService {

  private Map<String, WorkerDefinition> workers = null;

  public static final String TEMPLATES = "elt-templates";

  @Value("${workspace:workspace}")
  private String workspace;

  public Path resolve(String name) {
    return Path.of(workspace).resolve(TEMPLATES).resolve(name);
  }

  public List<String> findNames() {
    return Stream.of(Path.of(workspace).resolve(TEMPLATES).toFile().listFiles())
        .map(File::getName)
        .collect(Collectors.toList());
  }

  public JsonNode findByName(String name) throws IOException {
    return JsonUtils.fromJsonFile(resolve(name), JsonNode.class);
  }

  public void save(String name, JsonNode elementTemplate) throws IOException {
    JsonUtils.toJsonFile(resolve(name), elementTemplate);
  }

  public void deleteByName(String name) throws IOException {
    Files.delete(resolve(name));
  }

  public Collection<WorkerDefinition> getWorkers() {
    if (workers == null) {
      workers = new HashMap<>();
      String parentPackage = this.getClass().getPackage().getName();
      parentPackage = parentPackage.substring(0, parentPackage.lastIndexOf("."));
      Reflections reflections =
          new Reflections(
              new ConfigurationBuilder()
                  .forPackage(parentPackage)
                  .setScanners(Scanners.MethodsAnnotated));

      Set<Method> methods =
          reflections.getMethodsAnnotatedWith(
              io.camunda.zeebe.spring.client.annotation.JobWorker.class);
      for (Method m : methods) {
        JobWorker workerAnnotation = m.getAnnotation(JobWorker.class);
        WorkerDefinition def = new WorkerDefinition();
        if (StringUtils.isNotBlank(workerAnnotation.type())) {
          def.setType(workerAnnotation.type());
        } else {
          def.setType(m.getName());
        }
        if (StringUtils.isNotBlank(workerAnnotation.name())) {
          def.setName(workerAnnotation.name());
        } else {
          def.setName(m.getName());
        }
        if (workerAnnotation.fetchVariables() != null
            && workerAnnotation.fetchVariables().length > 0) {
          def.setFetchVariables(Sets.newHashSet(workerAnnotation.fetchVariables()));
        } else {
          def.setFetchVariables(new HashSet<>());
          Parameter[] params = m.getParameters();
          for (Parameter param : params) {
            Variable var = param.getAnnotation(Variable.class);
            if (var != null) {
              def.getFetchVariables().add(param.getName());
            } else {
              VariablesAsType varAsType = param.getAnnotation(VariablesAsType.class);
              if (varAsType != null) {
                List<Field> fields = new ArrayList<>();
                getAllFields(fields, param.getType());
                for (Field f : fields) {
                  def.getFetchVariables().add(f.getName());
                }
              }
            }
          }
        }
        workers.put(def.getType(), def);
      }
    }
    return workers.values();
  }

  public WorkerDefinition getWorkerDef(String worker) {
    if (workers == null) {
      getWorkers();
    }
    return workers.get(worker);
  }

  private List<Field> getAllFields(List<Field> fields, Class<?> type) {
    fields.addAll(Arrays.asList(type.getDeclaredFields()));

    if (type.getSuperclass() != null) {
      getAllFields(fields, type.getSuperclass());
    }

    return fields;
  }
}
