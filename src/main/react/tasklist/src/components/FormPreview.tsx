import React, { useState, useEffect, useLayoutEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {} from 'redux-thunk/extend-redux';
import { Form } from '@camunda-community/form-js-viewer';
import { IFormViewer } from '../store/model';

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function FormPreview(formViewer: IFormViewer) {
  const previewData = useSelector((state: any) => state.adminForms.previewData)
  useEffect(() => {
    try {
      let variables = JSON.parse(previewData);
      const container = document.querySelector('#task-form-preview');
      if (container && formViewer.schema) {
        container.innerHTML = '';

        let bpmnForm = new Form({ container: container });
        bpmnForm.importSchema(formViewer.schema, variables).then(
          function (result: any) {
            console.log(result);
          });
      }
    } catch (err: any) {
        console.error(err);
    }
  });



  return ( <div id="task-form-preview"></div>)
  
}

export default FormPreview;
