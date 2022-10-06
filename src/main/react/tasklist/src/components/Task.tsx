import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ITask } from '../store/model';
import taskService from '../service/TaskService';

import { useTranslation } from "react-i18next";

function Task(taskParam: { task: ITask }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentTask = useSelector((state: any) => state.process.currentTask)
  const task = taskParam.task;

  const getClassName = () => {
    if (currentTask != null && task.id == currentTask!.id) {
      return "card current";
    }
    return 'card';
  }

  const openTask = (event: any) => {
    dispatch(taskService.setTask(task));
  }

  return (
    <div className={getClassName()} style={{ width: '18rem' }} >
      <div className="card-body">
        <h5 className="card-title text-primary">{task.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{ task.processName }</h6>
        <p className="card-text">{ task.creationTime.slice(0, 19).replace("T", " ") }</p>
        <a v-if="task.taskState!='COMPLETED'" onClick={openTask} className="card-link">{t("Open")}</a>
      </div>
    </div>
  );
}

export default Task
