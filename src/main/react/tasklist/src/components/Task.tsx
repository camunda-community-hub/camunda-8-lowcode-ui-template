import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ITask } from '../store/model';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import taskService from '../service/TaskService';

import { useTranslation } from "react-i18next";

function Task(taskParam: { task: ITask }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentTask = useSelector((state: any) => state.process.currentTask)
  const task = taskParam.task;

  const getClassName = () => {
    if (currentTask != null && task.id == currentTask!.id) {
      return 'current';
    }
    return '';
  }

  const openTask = (event: any) => {
    dispatch(taskService.setTask(task));
  }
  const renderAssigneeTooltip = (props:any) => (
    <Tooltip id="button-tooltip" {...props}>
      {task.assignee}
    </Tooltip>
  );
  return (
    <tr className={getClassName()} onClick={openTask}>
      <td>{task.assignee ? <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={renderAssigneeTooltip}
      >
        <i className="bi bi-person-circle text-secondary"></i>
      </OverlayTrigger> : <></>}</td>
      <td>{task.formKey == "processVariableFormKey" ? task.variables.formKey : task.name}</td>
      <td>{task.processName}</td>
      <td>{task.creationTime.slice(0, 16).replace("T", " ")}</td>
    </tr>
  );
}

export default Task
