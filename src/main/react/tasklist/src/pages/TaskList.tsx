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

function TaskList() {
  const [showTaskFilter, setShowTaskFilter] = useState(false);

  const handleClose = () => setShowTaskFilter(false);
  const handleShow = () => setShowTaskFilter(true);

  const dispatch = useDispatch();
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
    dispatch(taskService.setTaskSearch(taskSearchClone));
  }

  useEffect(() => {
    dispatch(taskService.fetchTasks());
  });

  return (
    <div>
      <div className="row flex-nowrap">
        <Sidebar>
          <h2 className="text-primary">Tasks
            <Button variant="primary" onClick={handleShow}><i className="bi bi-funnel"></i></Button>
          </h2>
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
      <Modal show={showTaskFilter} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Task Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>State</InputGroup.Text>
                <Form.Select aria-label="state" value={taskSearch.state} onChange={(evt) => changeFilter('state', evt.target.value)}>
                  <option value="CREATED" >Created</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELED">Canceled</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>Assigned</InputGroup.Text>
                <Form.Select aria-label="assigned" value={taskSearch.assigned} onChange={(evt) => changeFilter('assigned', evt.target.value)}>
                  <option value="">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>Assignee :</InputGroup.Text>
                <Form.Select disabled={"true"!=taskSearch.assigned} aria-label="assignee" value={taskSearch.assignee} onChange={(evt) => changeFilter('assignee', evt.target.value)}>
                  <option value="">Any user</option>
                  <option value={authService.getUser()?.username}>Me</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>Group :</InputGroup.Text>
                <Form.Select disabled={"true" != taskSearch.assigned} aria-label="group" value={taskSearch.group} onChange={(evt) => changeFilter('group', evt.target.value)}>
                  <option value="">Any group</option>
                  {authService.getUser()?.groups.map((group: string, index: number) =>
                    <option key={group} value={group}>{group}</option>
                  )}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
  );
}

export default TaskList;
