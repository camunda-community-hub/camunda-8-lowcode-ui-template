import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ITask } from '../store/model';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import TasksFilter from '../components/TasksFilter';
import Task from '../components/Task';
import taskService from '../service/TaskService';

function TaskList() {

  const dispatch = useDispatch();
  const tasks = useSelector((state: any) => state.process.tasks)

  useEffect(() => {
    dispatch(taskService.fetchTasks());
  });

  return (
    <div>
      <div className="row flex-nowrap">
        <Sidebar>
          <h2>My tasks</h2>
          <div className="taskList">
            {tasks.map((task: ITask) => <Task task={task} key={task.id}></Task>)}
          </div>
        </Sidebar>
        <main className="mainContent col ps-md-2 pt-2">
          <div className="taskListFormContainer">
            <TaskForm />
          </div>
        </main>
        </div>
      </div>
  );
}

export default TaskList;
