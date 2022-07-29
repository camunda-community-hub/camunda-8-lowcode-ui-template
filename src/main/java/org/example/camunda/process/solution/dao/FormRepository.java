package org.example.camunda.process.solution.dao;

import java.util.List;
import org.example.camunda.process.solution.model.Form;
import org.springframework.data.jpa.repository.Query;

public interface FormRepository extends BaseRepository<Form> {

  Form findByName(String name);

  @Query("SELECT f.name FROM Form f ORDER BY f.name ASC")
  List<String> findNames();
}
