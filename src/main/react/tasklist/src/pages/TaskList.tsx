import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ITask } from '../store/model';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import Task from '../components/Task';
import taskService from '../service/TaskService';
import authService from '../service/AuthService';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { useTranslation } from "react-i18next";

let timeOutId: any | undefined = undefined;
function TaskList() {
  const [typing, setTyping] = useState(false);
  const tasklistConf = useSelector((state: any) => state.process.tasklistConf);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showTaskFilter, setShowTaskFilter] = useState(false);

  const handleClose = () => setShowTaskFilter(false);
  const handleShow = () => setShowTaskFilter(true);

  const loading = useSelector((state: any) => state.process.loading)
  const tasks = useSelector((state: any) => state.process.tasks)
  const taskSearch = useSelector((state: any) => state.process.taskSearch)
  type ObjectKey = keyof typeof taskSearch;


  const changeFilter = (property: ObjectKey, value: any) => {
    let taskSearchClone = Object.assign({}, taskSearch);
    if (value) {
      taskSearchClone![property] = value;
    } else {
      taskSearchClone![property] = null;
    }
    if (taskSearchClone.assigned == undefined || taskSearchClone.assigned == "false" ) {
      taskSearchClone.assignee = undefined;
      taskSearchClone.group = undefined;
    }
    dispatch(taskService.setTaskSearch(taskSearchClone));
  }

  const changeFilterVariableFilter = (variable: string, value: any) => {
    let taskSearchClone = JSON.parse(JSON.stringify(taskSearch));
    if (value == "") {
      taskSearchClone.filterVariables[variable] = undefined;
    } else {
      taskSearchClone.filterVariables[variable] = value;
    }
    dispatch(taskService.setTaskSearch(taskSearchClone));
  }

  const changePageSize = (value: any) => {
    let taskSearchClone = Object.assign({}, taskSearch);
    taskSearchClone.pageSize = value * 1;
    dispatch(taskService.setTaskSearch(taskSearchClone));
  }
  const before = () => {
    dispatch(taskService.before());
  }
  const after = () => {
    dispatch(taskService.after());
  }

  useEffect(() => {
    dispatch(taskService.loadTasklistConf());
  }, []);

  useEffect(() => {
    if (taskSearch && tasklistConf && !typing) {
      dispatch(taskService.fetchTasks());
    }
  }, [taskSearch, tasklistConf]);


  useEffect(() => {
    if (tasks.length > 0) {
      dispatch(taskService.setTask(tasks[0]));
    }
  }, [tasks]);

  useEffect(() => {
    if (typing) {
      setTyping(false);
      if (timeOutId) {
        clearTimeout(timeOutId);
      }
      timeOutId = setTimeout(() => dispatch(taskService.fetchTasks()), 600);
    }
  }, [typing]);

  return (
    tasks && tasklistConf && taskSearch ?
    <div className="row flex-nowrap">
      <Col className="tasklist ps-md-2 pt-2">
        <Table striped hover variant="light" className="taskListContainer">
          <thead >
            <tr >
              <th className="bg-primary text-light"></th>
              {tasklistConf.columns ? tasklistConf.columns.map((column: any, index: number) =>
                <th className="bg-primary text-light" key={index}>{column.label}</th>)
                : <></>}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: ITask) => <Task task={task} key={task.id}></Task>)}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={tasklistConf.columns ? tasklistConf.columns.length+1 : 1} >
              <div className="pagination">
                <Button variant="outline-primary" onClick={before} disabled={loading}><i className="bi bi-arrow-left"></i> before</Button>
                <div className="taskListFilter bg-lightgreen text-light">

                  <div className="text-primary">
                    {t("Show")} &nbsp;
                    <select value={taskSearch.pageSize} onChange={(evt) => changePageSize(evt.target.value)} disabled={loading}>
                      <option>5</option>
                      <option>10</option>
                      <option>20</option>
                      <option>50</option>
                    </select> &nbsp;
                    {t("results")}
                  </div>
                  <Button variant="primary" onClick={handleShow} disabled={loading}><i className="bi bi-funnel"></i></Button>
                </div>
                <Button variant="outline-primary" onClick={after} disabled={loading}>after <i className="bi bi-arrow-right"></i> </Button>
              </div>
            </td></tr>
          </tfoot>
        </Table>
      </Col>
      {tasklistConf.splitPage ?
        <Col className="ps-md-2 pt-2">
          <TaskForm />
        </Col> : <></>}
      <Modal show={showTaskFilter} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("Tasks filters")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {tasklistConf.defaultFilters.state ?
              <Col xs={12} sm={6} lg={6} xxl={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>{t("State")}</InputGroup.Text>
                  <Form.Select aria-label="state" value={taskSearch.state} onChange={(evt) => changeFilter('state', evt.target.value)}>
                    <option value="CREATED" >{t("Created")}</option>
                    <option value="COMPLETED">{t("Completed")}</option>
                    <option value="CANCELED">{t("Canceled")}</option>
                  </Form.Select>
                </InputGroup>
              </Col> : <></>}
            {tasklistConf.defaultFilters.assigned ?
                <Col xs={12} sm={6} lg={6} xxl={4}>
              <InputGroup className="mb-3">
                <InputGroup.Text>{t("Assigned")}</InputGroup.Text>
                    <Form.Select aria-label="assigned" value={taskSearch.assigned ? taskSearch.assigned : ''} onChange={(evt) => changeFilter('assigned', evt.target.value)}>
                      <option value="">{t("Any")}</option>
                      <option value="true">{t("Yes")}</option>
                      <option value="false">{t("No")}</option>
                </Form.Select>
              </InputGroup>
            </Col> : <></>}
            {tasklistConf.defaultFilters.assignee ?
            <Col xs={12} sm={6} lg={6} xxl={4}>
              <InputGroup className="mb-3">
                <InputGroup.Text>{t("Assignee")} :</InputGroup.Text>
                    <Form.Select disabled={"true" != taskSearch.assigned} aria-label="assignee" value={taskSearch.assignee ? taskSearch.assignee : ''} onChange={(evt) => changeFilter('assignee', evt.target.value)}>
                  <option value="">{t("Any user")}</option>
                  <option value={authService.getUser()?.username}>{t("Me")}</option>
                </Form.Select>
                </InputGroup>
              </Col> : <></>}
            {tasklistConf.defaultFilters.group ?
            <Col xs={12} sm={6} lg={6} xxl={4}>
              <InputGroup className="mb-3">
                <InputGroup.Text>{t("Group")} :</InputGroup.Text>
                    <Form.Select disabled={"true" != taskSearch.assigned} aria-label="group" value={taskSearch.group ? taskSearch.group : ''} onChange={(evt) => changeFilter('group', evt.target.value)}>
                  <option value="">{t("Any group")}</option>
                  {authService.getUser()?.groups ? authService.getUser()?.groups.map((group: string, index: number) =>
                    <option key={group} value={group}>{group}</option>
                  ) : <></>}
                </Form.Select>
              </InputGroup>
              </Col> : <></>}
            {tasklistConf.variablesFilters ? tasklistConf.variablesFilters.map((filter: any, index: number) =>
              <Col xs={12} sm={6} lg={6} xxl={4} key={index}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>{filter.customVariable} :</InputGroup.Text>
                  {filter.type == "list" ?
                    <Form.Select value={taskSearch.filterVariables[filter.customVariable]} onChange={(evt) => changeFilterVariableFilter(filter.customVariable, evt.target.value)}>
                      <option value="">{t("Any value")}</option>
                      {filter.values ? filter.values.map((value: string, indexVariable: number) =>
                        <option key={indexVariable} value={value}>{value}</option>
                      ) : <></>}
                    </Form.Select>
                    :

                    filter.type == "boolean" ?
                      <Form.Select value={taskSearch.filterVariables[filter.customVariable]} onChange={(evt) => changeFilterVariableFilter(filter.customVariable, evt.target.value)}>
                      <option value="">{t("Any value")}</option>
                      <option value="true">{t("Yes")}</option>
                      <option value="false">{t("No")}</option>
                    </Form.Select>
                      :
                        <Form.Control type={filter.type} value={taskSearch.filterVariables[filter.customVariable]} onChange={(evt) => { changeFilterVariableFilter(filter.customVariable, evt.target.value); setTyping(true); }} />

                  }
                </InputGroup>
                </Col>)
                : <></>
              }
          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      : <></>
  );
}

export default TaskList;
