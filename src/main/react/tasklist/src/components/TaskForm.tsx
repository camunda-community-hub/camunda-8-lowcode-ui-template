import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {} from 'redux-thunk/extend-redux';
import authService from '../service/AuthService';
import taskService from '../service/TaskService';
import FormResolver from './FormResolver';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

import { useTranslation } from "react-i18next";

function TaskForm(props: any) {
  const { t } = useTranslation();
  const [enlarged, setEnlarged] = useState<boolean>(false);
  const dispatch = useDispatch();
  const currentTask = useSelector((state: any) => state.process.currentTask)
  const currentSchema = useSelector((state: any) => state.process.currentFormSchema)
  const disabled = !currentTask || !currentTask.assignee || currentTask.assignee != authService.getUser()!.username;

  const claim = () => {
	dispatch(taskService.claim());
  }
  const unclaim = () => {
	dispatch(taskService.unclaim());
  }
  const renderAssigneeTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {currentTask.assignee}
    </Tooltip>
  );
  return (
    currentTask ?
      <div className={enlarged ? "taskListFormContainer enlarged" : "taskListFormContainer"}>
      <div className="card taskform">
        <h5 className="card-title bg-primary text-light" > {currentTask.name} {currentTask.assignee ? <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderAssigneeTooltip}
        >
          <i className="bi bi-person-circle "></i>
        </OverlayTrigger> : <></>}</h5>
        <div className="btnClaimUnClaim">
            {currentTask.assignee ?
              <Button variant="dark" onClick={unclaim}> {t("Unclaim")}</Button>
              :
              <Button variant="dark" onClick={claim}>{t("Claim")}</Button>
            }
            {enlarged ?
              <Button variant="outline-light" className="enlarge" onClick={() => setEnlarged(false)}><i className="bi bi-arrows-angle-contract"></i></Button>
              :
              <Button variant="outline-light" className="enlarge" onClick={() => setEnlarged(true)}><i className="bi bi-arrows-angle-expand"></i></Button>
            }
          </div>
        <FormResolver formKey={currentTask.formKey} schema={currentSchema} variables={currentTask.variables} disabled={disabled}></FormResolver>
	  </div></div> : <div />
  )
  
}

export default TaskForm;


