import React, { useEffect } from 'react';
import {useSelector} from 'react-redux';
import type { } from 'redux-thunk/extend-redux';
import adminFormService from '../service/AdminFormService';
import { Form as ExtendedForm} from '@camunda-community/form-js-viewer';
import { Form } from '@bpmn-io/form-js-viewer';
import { IFormViewer } from '../store/model';

function FormPreview(formViewer: IFormViewer) {
  const previewData = useSelector((state: any) => state.adminForms.previewData)

  const form = adminFormService.getCurrentForm();
  useEffect(() => {
    const container = document.querySelector('#task-form-preview');
    try {
      let variables = JSON.parse(previewData);
       if (container && formViewer.schema) {
         container.innerHTML = '';

         let bpmnForm = null;
         console.log(formViewer);
         if (form.generator == 'extendedFormJs') {
           bpmnForm = new ExtendedForm({ container: container });
         } else {
           bpmnForm = new Form({ container: container });
         }

         bpmnForm.importSchema(formViewer.schema, variables).then(
           function (data: any) {
               console.log(data);
           });
      }
    } catch (errors: any) {
      console.log(errors);
      container!.innerHTML = errors;
    }
  });



  return ( <div id="task-form-preview"></div>)
  
}

export default FormPreview;
