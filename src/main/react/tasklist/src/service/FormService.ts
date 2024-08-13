import store, { AppThunk } from '../store';
import customForms from '../forms/';
import { IFormViewer, ITask } from '../store/model';
import { Component, FC } from 'react';
import api from './api';
import { setFormSchema } from '../store/features/processes/slice';

export class FormService {

  customFormExists = (formKey: string | null): boolean => {
    if (formKey && customForms.has(formKey)) {
      return true;
    }
    return false;
  }

  getCustomForm = (formKey: string | null): FC<IFormViewer> | null => {
    if (this.customFormExists(formKey)) {
      return customForms.get(formKey!)!;
    }
    return null;
  }

  getMessageForm = async (formKey: string):Promise<any> => {
    if (!this.customFormExists(formKey)) {
      let ln = localStorage.getItem('camundLocale');
      const { data } = await api.get('/casemgmt/form/' + formKey+'?ln='+ln);
      return data;
    }
    return null;
  }

  loadForm = (task: ITask): AppThunk => async dispatch => {
    if (task.formKey === "processVariableFormKey") {
      task.formKey = task.variables.formKey;
    }
    if (!this.customFormExists(task.formKey)) {
      if (!task.jobKey) {
        let ln = localStorage.getItem('camundLocale');
        let url = '/forms/' + task.processDefinitionKey + '/' + task.formKey + '/' + ln;
        if (task.formId) {
          url = '/forms/' + task.processDefinitionKey + '/linked/' + task.formId + '/' + ln;
        } else if (task.formKey.startsWith("camunda-forms:bpmn:")) {
          url = '/forms/' + task.processDefinitionKey + '/embedded/' + task.formKey + '/' + ln;
        }
        const { data } = await api.get(url);
        dispatch(setFormSchema(data));
      } else {
        const { data } = await api.get('/jobKey/form/' + task.processDefinitionKey + '/' + task.taskDefinitionId);
        if (!data) {
          this.retry(dispatch(this.loadForm(task)));
        } else {
          dispatch(setFormSchema(data));
        }
        
      }
    }
  }

  retry = (callback: any) => {
    setTimeout(() => {
      callback();
    }, 300);
  }
}

const formService = new FormService();

export default formService;
