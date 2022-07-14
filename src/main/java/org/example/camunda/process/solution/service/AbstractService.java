package org.example.camunda.process.solution.service;

import java.util.List;
import java.util.Optional;

import org.example.camunda.process.solution.dao.BaseRepository;
import org.example.camunda.process.solution.model.BaseEntity;
import org.springframework.data.jpa.domain.Specification;

public abstract class AbstractService<T extends BaseEntity> {

	protected abstract BaseRepository<T> getRepository();

    public T getById(Long id) {
        Optional<T> entity = getRepository().findById(id);
        if (entity.isPresent()) {
        	return entity.get();
        }
        return null;
    }    
    
    public List<T> all() {
        return getRepository().findAll();
    }
	
	public T create(T object) {
		return getRepository().save(object);
	}

	public T update(T u) {
		return getRepository().save(u);
	}
	
	public boolean delete(Long id) {
        getRepository().deleteById(id);
        return true;
    }

	public Long count() {
		return count(null);
	}
	
	public Long count(Specification<T> query) {
		if (query==null) {
			return getRepository().count();
		}
		return getRepository().count(query);
	}

	public void deleteAll() {
		getRepository().deleteAll();
	}
	
}
