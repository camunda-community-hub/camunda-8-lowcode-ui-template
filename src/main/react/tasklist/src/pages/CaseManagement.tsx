import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { IInstanceViewer, IProcess, ITask } from '../store/model';
import NavigatedViewer from 'camunda-bpmn-js/lib/camunda-cloud/NavigatedViewer';
import Sidebar from '../components/Sidebar';
import api from '../service/api';
import processService from '../service/ProcessService';
import { Form, InputGroup, Table, Button, Row, Col, Accordion } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { AxiosResponse } from 'axios';
import taskService from '../service/TaskService';

function CaseManagement() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const processes = useSelector((state: any) => state.process.processes)
  const [proc, setProc] = useState<IProcess | null>(null);
  const [xml, setXml] = useState<string | null>(null);
  const [caseMgmtConf, setCaseMgmtConf] = useState<any | null>(null);


  useEffect(() => {
    dispatch(processService.fetchProcesses());

    api.get('/casemgmt').then((response: any) => {
      setCaseMgmtConf(response.data);
    }).catch((error: any) => {
      alert(error.message);
    });
  },[]);

  const openProcess = (process: IProcess) => {
    setProc(process);
  }

  useEffect(() => {
    if (proc) {
      api.get('/process/xml/' + proc?.key).then((response: any) => {
        setXml(response.data);
      }).catch((error: any) => {
        alert(error.message);
      });
    }
  }, [proc]);

  const addMessageConfIfRequired = (elt: any, elementId: string|null) => {
    let found = false;
    for (let i = 0; i < caseMgmtConf[proc!.bpmnProcessId].length; i++) {
      let conf = caseMgmtConf[proc!.bpmnProcessId][i];
      if (conf.message == elt.businessObject.eventDefinitions[0].messageRef.name) {
        found = true;
        break;
      }
    }
    if (!found) {
      caseMgmtConf[proc!.bpmnProcessId].push({
        "message": elt.businessObject.eventDefinitions[0].messageRef.name,
        "name": elt.businessObject.name,
        "enabled": false,
        "bpmnProcessId": proc!.bpmnProcessId,
        "elementId": elementId,
        "formKey": null
      })
      setCaseMgmtConf(caseMgmtConf);
    }
  }

  useEffect(() => {
    if (proc && xml && caseMgmtConf) {
      if (!caseMgmtConf[proc.bpmnProcessId]) {
        caseMgmtConf[proc.bpmnProcessId] = [];
        setCaseMgmtConf(caseMgmtConf);
      }

      document.getElementById('diagramViewer')!.innerHTML = "";
      let viewer = new NavigatedViewer({
        container: document.getElementById('diagramViewer'),
        height: 300
      });
      viewer.importXML(xml).then((result: any) => {
        const eltRegistry: any = viewer!.get('elementRegistry');
        eltRegistry.forEach((elt: any) => {
          if (elt.type == "bpmn:BoundaryEvent" && elt.businessObject.eventDefinitions && elt.businessObject.eventDefinitions[0].$type == "bpmn:MessageEventDefinition") {
            addMessageConfIfRequired(elt, elt.host.id);
            console.log(elt);
          }

          if (elt.type == "bpmn:StartEvent" && elt.businessObject.eventDefinitions && elt.businessObject.eventDefinitions[0].$type == "bpmn:MessageEventDefinition") {
            addMessageConfIfRequired(elt, null);
              console.log(elt);
            }
          /*if (this.execPlanService.isManagedActivity(elt.type)) {
            console.log(elt.di.bpmnElement.name);

            if (stepScenar.indexOf(elt.id) < 0) {
              this.colorActivity(elt.id, "#000000");
            }
          }*/
        });
      });
    }
  }, [xml, caseMgmtConf]);


  const colorActivity = (navigatedViewer: any, id: string, color: string) => {
    console.log(navigatedViewer);
    console.log(id);
    const elementRegistry = navigatedViewer.get('elementRegistry');
    const graphicsFactory = navigatedViewer.get('graphicsFactory');
    const element = elementRegistry.get(id);
    console.log(elementRegistry);
    console.log(element);
    if (element?.di !== undefined) {
      element.di.set('stroke', color);

      const gfx = elementRegistry?.getGraphics(element);
      if (gfx !== undefined) {
        graphicsFactory?.update('connection', element, gfx);
      }
    }
  };

  return (
    <div className="row flex-nowrap">
      <Sidebar>
        {processes && processes.map((process: IProcess) =>
          <div className="card" key={process.key}>
            <div className="card-body" key={process.key} onClick={() => openProcess(process)}>
              <h5 className="card-title text-primary">{process.name} v{process.version}</h5>
            </div>
          </div>)}
      </Sidebar>
      <main className="mainContent col ps-md-2 pt-2">
        <div className="taskListFormContainer">
          {xml ?
            <div id="diagramViewer"></div>
            : <></>}
          {proc && caseMgmtConf && caseMgmtConf[proc.bpmnProcessId] && caseMgmtConf[proc.bpmnProcessId].map((conf: any) =>
            <div>{conf.message}</div>
            )}
        </div>
      </main>
    </div>
  );
}

export default CaseManagement;
