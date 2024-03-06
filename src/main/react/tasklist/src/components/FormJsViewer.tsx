import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import type { } from 'redux-thunk/extend-redux';
import taskService from '../service/TaskService';
import processService from '../service/ProcessService';
import { Form } from '@bpmn-io/form-js-viewer';
import { IFormViewer } from '../store/model';

import { useTranslation } from "react-i18next";

function FormJsViewer(formViewer: IFormViewer) {
  const { t } = useTranslation();
  const tasklistConf = useSelector((state: any) => state.process.tasklistConf)
  const task = useSelector((state: any) => state.process.currentTask)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let errors: string[] = [];
  const [bpmnForm, setBpmnForm] = useState<Form | null>(null);

  useEffect(() => {
    const container = document.getElementById('task-form');
    if (container && formViewer.schema) {
      container.innerHTML = '';

      let bpmnForm = new Form({ container: container });
      if (formViewer.disabled) {
        bpmnForm.setProperty('readOnly', true);
      }
      bpmnForm.importSchema(formViewer.schema, formViewer.variables).then(
        function (result: any) {
          console.log(result);
        });
      setBpmnForm(bpmnForm);
    }
  }, [formViewer]);


  const submit = () => {
    if (bpmnForm != null) {
      bpmnForm.validate();

      for (const field in bpmnForm._getState().errors) {
        if (bpmnForm._getState().errors[field].length > 0) {
          Array.prototype.push.apply(errors, bpmnForm._getState().errors[field]);
        }
      }
      if (errors.length == 0) {
        if (formViewer.variables) {
          if (!tasklistConf.splitPage) {
            dispatch(taskService.submitTask(bpmnForm._getState().data, navigate("/tasklist")));
          } else {
            dispatch(taskService.submitTask(bpmnForm._getState().data));
          }
        } else {
          dispatch(processService.instantiate(bpmnForm._getState().data));
        }
      }
    }
  }

  return (
    <div>
      <div id="task-form"></div>
      <div className="ms-2 me-2 mb-2 d-flex justify-content-between">
        <button disabled={formViewer.disabled} type="button" className="btn btn-primary" onClick={submit}><i className="bi bi-send"></i> {t("Submit")}</button>
      </div>
    </div>
  )

}

export default FormJsViewer;
