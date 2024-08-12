import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { ITask } from '../store/model';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import taskService from '../service/TaskService';
import moment from "moment";

import { useTranslation } from "react-i18next";

function Task(taskParam: { task: any }) {
  const navigate = useNavigate();
  const tasklistConf = useSelector((state: any) => state.process.tasklistConf)
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
    console.log(tasklistConf);
    if (!tasklistConf.splitPage) {
      dispatch(taskService.setTask(task, navigate("/tasklist/taskForm")));
    } else {
      dispatch(taskService.setTask(task));
    }
  }
  const renderAssigneeTooltip = (props:any) => (
    <Tooltip id="button-tooltip" {...props}>
      {task.assignee}
    </Tooltip>
  );

  const display = (column: any): string => {
    let key = column.value;
    if (key == "customValue") {
      key = column.customValue;
    }
    let value = "";
    if (column.variable) {
      value = task.variables[key];
    } else {
      value = task[key];
    }
    if (value && column.type == "date" && tasklistConf.formatDate && tasklistConf.formatDate != "") {
      return moment(value).format(tasklistConf.formatDate);
    }
    if (value && column.type == "dateTime" && tasklistConf.formatDate && tasklistConf.formatDate != "") {
      return moment(value).format(tasklistConf.formatDatetime);
    }
    if (value && column.type == "object") {
      return JSON.stringify(value);
    }
    return value;
  }
  const className = (column: any): string => {
    if (column.value == 'dueDate') {
      let value = task.dueDate;
      if (value) {
        let valDate = new Date(value);
        if (valDate < new Date()) { return 'danger'; }
        if (valDate.toISOString().substring(0, 10) == new Date().toISOString().substring(0, 10)) { return 'warning'; }
       
      }
    }
    return '';
  }


  return (
    <tr className={getClassName()} onClick={openTask}>
      <td>{task.assignee ? <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={renderAssigneeTooltip}
      >
        <i className="bi bi-person-circle text-secondary"></i>
      </OverlayTrigger> : <></>}</td>
      {tasklistConf && tasklistConf.columns ? tasklistConf.columns.map((column: any, index: number) =>
        <td key={index} className={className(column)}>{display(column)}
        </td>)
        : <></>}
    </tr>
  );
}

export default Task
