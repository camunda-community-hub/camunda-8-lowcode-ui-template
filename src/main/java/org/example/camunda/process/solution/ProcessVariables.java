package org.example.camunda.process.solution;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class ProcessVariables {

    private String businessKey;
    private Boolean result;

    public String getBusinessKey() {
        return businessKey;
    }

    public Boolean isResult() {
        return result;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public void setResult(Boolean result) {
        this.result = result;
    }    

}
