package org.example.camunda.process.solution.service;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.stereotype.Service;

@Service
public class MyService {

    public boolean myOperation(String businessKey) throws JsonProcessingException {
        return true;
    }

}
