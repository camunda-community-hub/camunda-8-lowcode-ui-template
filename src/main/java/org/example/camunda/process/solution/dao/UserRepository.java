package org.example.camunda.process.solution.dao;

import org.example.camunda.process.solution.model.User;

public interface UserRepository extends BaseRepository<User> {

	User findByUsername(String username);

}
