import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { IInstanceViewer, ITask } from '../store/model';
import NavigatedViewer from 'camunda-bpmn-js/lib/camunda-cloud/NavigatedViewer';
import api from '../service/api';
import { Form, InputGroup, Table, Button, Row, Col, Accordion } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { AxiosResponse } from 'axios';
import taskService from '../service/TaskService';
import CaseMgmtComponent from './CaseMgmtComponent';

function InstanceView(props: IInstanceViewer) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [xml, setXml] = useState<string | null>(null);
  const [histo, setHisto] = useState<any[] | null>(null);
  const [tasks, setTasks] = useState<ITask[] | null>(null);
  const [state, setState] = useState("CREATED");
  const tasklistConf = useSelector((state: any) => state.process.tasklistConf);

  useEffect(() => {
    if (props && props.instancekey) {
      api.get('/process/xml/' + props.processDefinitionKey).then((response: any) => {
        setXml(response.data);
      }).catch((error: any) => {
        alert(error.message);
      })
      api.get('/process/histo/' + props.instancekey).then((response: any) => {
        setHisto(response.data);
      }).catch((error: any) => {
        alert(error.message);
      })
      loadTasks();
    }
  }, [props.instancekey]);

  useEffect(() => {
    loadTasks();
  }, [state]);

  const loadTasks = () => {
    let tasksUrl = '/instances/tasks/' + props.instancekey;
    if (state != 'ANY') {
      tasksUrl += '?state=' + state;
    }
    api.get(tasksUrl).then((response: AxiosResponse<ITask[]>) => {
      setTasks(response.data);
    }).catch((error: any) => {
      alert(error.message);
    })
  } 

  useEffect(() => {
    if (histo && xml) {
      document.getElementById('instanceDiagramViewer')!.innerHTML = "";
      let viewer = new NavigatedViewer({
        container: document.getElementById('instanceDiagramViewer'),
        height: 300
      });
      viewer.importXML(xml).then((result: any) => {
  
      for (let i = histo.length - 1; i >= 0; i--) {
        if (histo[i].state != "TERMINATED") {
          if (histo[i].incident === true) {
            colorActivity(viewer, histo[i].flowNodeId, "#CC0000");
          } else if (histo[i].state === "ACTIVE") {
            colorActivity(viewer, histo[i].flowNodeId, "#00CC00");
          } else {
            colorActivity(viewer, histo[i].flowNodeId, "#6699CC");
          }
        }
      }
        //this.colorSelectedActivity('blop');
      });
    }
  }, [xml, histo]);


  const colorActivity = (navigatedViewer: any, id: string, color: string) => {
    const elementRegistry = navigatedViewer.get('elementRegistry');
    const graphicsFactory = navigatedViewer.get('graphicsFactory');
    const element = elementRegistry.get(id);
    if (element?.di !== undefined) {
      element.di.set('stroke', color);

      const gfx = elementRegistry?.getGraphics(element);
      if (gfx !== undefined) {
        graphicsFactory?.update('connection', element, gfx);
      }
    }
  };

  const openTask = (task: ITask) => {
    dispatch(taskService.setTask(task, navigate("/tasklist/taskForm")));
  }

  return (
    <Accordion defaultActiveKey="1">
      <Accordion.Item eventKey="0">
        <Accordion.Header>History</Accordion.Header>
        <Accordion.Body>
          <div id="instanceDiagramViewer"></div>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Attached tasks</Accordion.Header>
        <Accordion.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>{t("State")}</InputGroup.Text>
            <Form.Select aria-label="state" value={state} onChange={(evt) => setState(evt.target.value)}>
              <option value="ANY" >{t("Any")}</option>
              <option value="CREATED" >{t("Created")}</option>
              <option value="COMPLETED">{t("Completed")}</option>
              <option value="CANCELED">{t("Canceled")}</option>
              <option value="FAILED">{t("Failed")}</option>
            </Form.Select>
          </InputGroup>
      {tasks ?
        <Table striped hover variant="light" className="taskListContainer">
          <thead >
            <tr >
              <th className="bg-primary text-light">#</th>
              <th className="bg-primary text-light">Name</th>
              <th className="bg-primary text-light">state</th>
            </tr>
          </thead>
          <tbody>
                {tasks.map((task: ITask) => <tr key={task.id} onClick={()=>openTask(task) }><td>{task.id}</td><td>{task.name}</td><td>{task.taskState}</td></tr>)}
          </tbody>

        </Table>
            : <></>}
          <CaseMgmtComponent type='instance' taskEltId={null} processDefinitionKey={null} bpmnProcessId={tasklistConf.instancesBpmnProcessId} processInstanceKey={props.instancekey} variables={props.variables} />
          </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default InstanceView;
