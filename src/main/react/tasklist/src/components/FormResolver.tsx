import React, { useState, useEffect } from 'react';
import FormJsViewer from './FormJsViewer';
import CommunityFormJsViewer from './CommunityFormJsViewer';
import FormIoViewer from './FormIoViewer';
import formService from '../service/FormService'
import { IFormViewer } from '../store/model';
import { Component, FC } from 'react';

const getFormFinder = (formViewer: IFormViewer): FC<IFormViewer> => {
  if (formService.customFormExists(formViewer.formKey)) {
    return formService.getForm(formViewer.formKey)!;
  }
  if (formViewer.schema?.generator == 'formIo') {
    return FormIoViewer;
  }
  if (formViewer.schema?.generator == 'extendedFormJs') {
    return CommunityFormJsViewer;
  }
  return FormJsViewer;
}

function FormResolver(formViewer: IFormViewer) {
  const FormFinder: FC<IFormViewer> = getFormFinder(formViewer);
  return (<FormFinder formKey={formViewer.formKey} schema={formViewer.schema} variables={formViewer.variables} disabled={formViewer.disabled}></FormFinder>)
}

export default FormResolver;
