import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import type {} from 'redux-thunk/extend-redux';
import taskService from '../service/TaskService';
import processService from '../service/ProcessService';
import { IFormViewer } from '../store/model';
import { Formio } from 'formiojs';
import { Alert } from 'react-bootstrap';

import { useTranslation } from "react-i18next";

let formIoForm:any = null;
function FormIoViewer(formViewer: IFormViewer) {
  const { t } = useTranslation();
  const tasklistConf = useSelector((state: any) => state.process.tasklistConf)
  const task = useSelector((state: any) => state.process.currentTask)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const docs = useSelector((state: any) => state.documents.docs)
  const missingDocs = useSelector((state: any) => state.documents.missingDocs)

  const loadFormIo = async () => {
    formIoForm = await Formio.createForm(document.getElementById(formViewer.id), formViewer.schema!);
    formIoForm.submission = {
      data: formViewer.variables,
    };
    console.log(formIoForm);
  }

  useEffect(() => {
    loadFormIo();
  }, [formViewer]);

  const submit = () => {
    if (formViewer.variables) {
      if (!tasklistConf.splitPage) {
        dispatch(taskService.submitTask(formIoForm._data, navigate("/tasklist")));
      } else if (formViewer.id == 'page-form') {
        dispatch(taskService.submitTask(formIoForm._data, navigate("/tasklist/instances")));
      } else {
        dispatch(taskService.submitTask(formIoForm._data));
      }
    } else {
      dispatch(processService.instantiate(formIoForm._data));
    }
  }
  
  return (
    <div>
      <div id={formViewer.id} ></div>
      {missingDocs && missingDocs.length > 0 ?
        <Alert variant="danger">Please provide the missing documents : {missingDocs.map((doc: string, index: number) => <b key={index}>{doc}{index < missingDocs.length - 1 ? ', ' : ''}</b>)}</Alert>
        : <></>}
      <div className="ms-2 me-2 mb-2 d-flex justify-content-between">
        <button disabled={formViewer.disabled || (missingDocs && missingDocs.length > 0)} type="button" className="btn btn-primary" onClick={submit}><i className="bi bi-send"></i> {t("Submit")}</button>
      </div>
    </div>
  )
  
}

export default FormIoViewer;


