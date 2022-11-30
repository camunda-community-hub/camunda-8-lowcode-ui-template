import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminFormService from '../service/AdminFormService';
import { FormEditor } from '@camunda-community/form-js-editor';

function AdminFormEdit() {
  const dispatch = useDispatch();

  const form = adminFormService.getCurrentForm(); // useSelector((state: any) => state.adminForms.currentForm)


  useEffect(() => {
    let div = document.querySelector('#form-editor');
    div!.innerHTML = '';
    const formEditor = new FormEditor({
      container: div
    });
    formEditor.importSchema(form.schema);
    dispatch(adminFormService.setFormEditor(formEditor));
  }, []);
  return (
    <div id="form-editor"></div>
  );
}

export default AdminFormEdit
