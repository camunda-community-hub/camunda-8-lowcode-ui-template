import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {} from 'redux-thunk/extend-redux';
import taskService from '../service/TaskService';
import processService from '../service/ProcessService';
import { IFormViewer } from '../store/model';
import { Formio } from 'formiojs';

import { useTranslation } from "react-i18next";

let formIoForm:any = null;
function FormIoViewer(formViewer: IFormViewer) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const loadFormIo = async () => {
    formIoForm = await Formio.createForm(document.getElementById('formio'), formViewer.schema!);
    formIoForm.submission = {
      data: formViewer.variables,
    };
    console.log(formIoForm);
  }

  useEffect(() => {
    loadFormIo();
  }, []);

  const submit = () => {
    if (formViewer.variables) {
      dispatch(taskService.submitTask(formIoForm._data));
    } else {
      dispatch(processService.instantiate(formIoForm._data));
    }
  }

  return (
    <div>
      <div id="formio"></div>
      <div className="ms-2 me-2 mb-2 d-flex justify-content-between">
        <button disabled={formViewer.disabled} type="button" className="btn btn-primary" onClick={submit}><i className="bi bi-send"></i> {t("Submit")}</button>
      </div>
    </div>
  )
  
}

export default FormIoViewer;


