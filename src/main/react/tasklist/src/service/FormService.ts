import customForms from '../forms/';
import { IFormViewer } from '../store/model';
import { Component, FC } from 'react';

export class FormService {

  customFormExists = (formKey: string|null): boolean => {
    if (formKey && customForms.has(formKey)) {
      return true;
    }
    return false;
  }

  getForm = (formKey: string|null): FC<IFormViewer>|null => {
    if (this.customFormExists(formKey)) {
      return customForms.get(formKey!)!;
    }
    return null;
  }
}

const formService = new FormService();

export default formService;
