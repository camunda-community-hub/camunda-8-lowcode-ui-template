package org.example.camunda.process.solution.service;

import org.example.camunda.process.solution.dao.UserRepository;
import org.example.camunda.process.solution.exception.UnauthorizedException;
import org.example.camunda.process.solution.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService extends AbstractService<User> {
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	protected UserRepository getRepository() {
		return userRepository;
	}
	
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
	
    @Override
	public User create(User user) {
		if (getUserByUsername(user.getUsername())!=null) {
			throw new UnauthorizedException("Account already exists");
		}
		//user.setPassword(SecurityUtils.cryptPwd(user.getPassword()));
		
		userRepository.save(user);
		
		return user;
	}

    @Override
	public User update(User u) {
		User duplicate = getUserByUsername(u.getUsername());
		if (duplicate!=null && !duplicate.getId().equals(u.getId())) {
			throw new UnauthorizedException("Account already exists");
		}
		return userRepository.save(u);
	}
}
