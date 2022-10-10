import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {} from 'redux-thunk/extend-redux';
import taskService from '../service/TaskService';
import processService from '../service/ProcessService';
import { IFormViewer } from '../store/model';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import { useTranslation } from "react-i18next";

function AnotherCustomForm(formViewer: IFormViewer) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let formData:any = Object.assign({}, formViewer.variables);

  const setFormData = (attribute: string, value: string) => {
    formData[attribute] = value;
  }

  const submit = () => {
    if (formViewer.variables) {
      dispatch(taskService.submitTask(formData));
    } else {
      dispatch(processService.instantiate(formData));
    }
  }

  return (
    <div>
      <InputGroup className="mb-3">
        <InputGroup.Text> {t("Language name")}</InputGroup.Text>
        <Form.Control aria-label="name" placeholder="language name" defaultValue={formData.intialMessage} onChange={(evt) => setFormData('intialMessage', evt.target.value)} />
      </InputGroup>
      
      <div className="ms-2 me-2 mb-2 d-flex justify-content-between">
        <button disabled={formViewer.disabled} type="button" className="btn btn-primary" onClick={submit}><i className="bi bi-send"></i> {t("Submit")}</button>
      </div>
    </div>
  )
  
}

export default AnotherCustomForm;


