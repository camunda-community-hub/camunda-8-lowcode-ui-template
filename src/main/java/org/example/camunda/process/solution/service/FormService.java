package org.example.camunda.process.solution.service;

import java.util.List;
import org.example.camunda.process.solution.dao.FormRepository;
import org.example.camunda.process.solution.exception.UnauthorizedException;
import org.example.camunda.process.solution.model.Form;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FormService extends AbstractService<Form> {

  @Autowired private FormRepository formRepository;

  @Override
  protected FormRepository getRepository() {
    return formRepository;
  }

  public List<Form> findAll() {
    return formRepository.findAll();
  }

  public Form findByName(String name) {
    return formRepository.findByName(name);
  }

  @Override
  public Form create(Form form) {
    if (findByName(form.getName()) != null) {
      throw new UnauthorizedException("Form already exists");
    }

    formRepository.save(form);

    return form;
  }

  @Override
  public Form update(Form u) {
    Form duplicate = findByName(u.getName());
    if (duplicate != null && !duplicate.getId().equals(u.getId())) {
      throw new UnauthorizedException("Account already exists");
    }
    return formRepository.save(u);
  }

  public List<String> findNames() {
    return formRepository.findNames();
  }
}
