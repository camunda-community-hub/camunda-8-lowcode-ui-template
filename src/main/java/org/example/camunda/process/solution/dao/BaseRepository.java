package org.example.camunda.process.solution.dao;

import java.util.Optional;

import org.example.camunda.process.solution.model.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BaseRepository<T extends BaseEntity>  extends JpaRepository<T, Long>, JpaSpecificationExecutor<T> {

	Optional<T> findById(Long id);
	
}
