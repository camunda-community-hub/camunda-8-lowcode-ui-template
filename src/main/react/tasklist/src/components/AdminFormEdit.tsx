import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminFormService from '../service/AdminFormService';
import { FormEditor as CommunityFormEditor } from '@camunda-community/form-js-editor';
import { FormEditor } from '@bpmn-io/form-js-editor';
import { FormBuilder } from 'formiojs';

function AdminFormEdit() {
  const dispatch = useDispatch();

  const form = adminFormService.getCurrentForm();


  useEffect(() => {
    let div = document.querySelector('#form-editor');
    div!.innerHTML = '';
    if (form.generator == 'formJs') {
      const formEditor = new FormEditor({
        container: div
      });
      formEditor.importSchema(form.schema);
      dispatch(adminFormService.setFormEditor(formEditor));
    } else if (form.generator == 'extendedFormJs') {
      const formEditor = new CommunityFormEditor({
        container: div
      });
      formEditor.importSchema(form.schema);
      dispatch(adminFormService.setFormEditor(formEditor));
    } else {
      const formBuilder = new FormBuilder(div, JSON.parse(JSON.stringify(form.schema)), { noDefaultSubmitButton: true });
      dispatch(adminFormService.setFormBuilder(formBuilder));
    }
  }, []);
  return (
    <div id="form-editor"></div>
  );
}

export default AdminFormEdit
