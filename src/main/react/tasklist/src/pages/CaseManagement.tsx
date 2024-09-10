import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { IInstanceViewer, IProcess, ITask } from '../store/model';
import NavigatedViewer from 'camunda-bpmn-js/lib/camunda-cloud/NavigatedViewer';
import Sidebar from '../components/Sidebar';
import api from '../service/api';
import processService from '../service/ProcessService';
import { Form, InputGroup } from 'react-bootstrap';

import { useTranslation } from "react-i18next";

function CaseManagement() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const processes = useSelector((state: any) => state.process.processes)
  const [proc, setProc] = useState<IProcess | null>(null);
  const [xml, setXml] = useState<string | null>(null);
  const [messageConf, setMessageConf] = useState<string | null>(null);
  const [caseMgmtConf, setCaseMgmtConf] = useState<any | null>(null);
  const [viewer, setViewer] = useState<any | null>(null);

  useEffect(() => {
    dispatch(processService.fetchProcesses());
    api.get('/casemgmt').then((response: any) => {
      setCaseMgmtConf(response.data);

    }).catch((error: any) => {
      alert(error.message);
    });
  }, []);

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

  const addMessageConfIfRequired = (elt: any, elementIds: string[] | null): any => {
    for (let i = 0; i < caseMgmtConf.bpmnProcessIdMessages[proc!.bpmnProcessId].length; i++) {
      let conf = caseMgmtConf.bpmnProcessIdMessages[proc!.bpmnProcessId][i];
      if (conf.id == elt.id) {
        return conf;
      }
    }
    console.log(elementIds);
    let clone = Object.assign({}, caseMgmtConf);
   let conf = {
      "id": elt.id,
      "message": elt.businessObject.eventDefinitions[0].messageRef.name,
      "correlationKey": elt.businessObject.eventDefinitions[0].messageRef.extensionElements.values[0].correlationKey,
      "name": elt.businessObject.name,
      "enabled": false,
      "bpmnProcessId": proc!.bpmnProcessId,
      "elementIds": elementIds,
      "formKey": null
    };
    clone.bpmnProcessIdMessages[proc!.bpmnProcessId].push(conf);
    setCaseMgmtConf(clone);
    return conf;
  }

  useEffect(() => {
    if (proc && xml != null && caseMgmtConf != null) {
      if (!caseMgmtConf.bpmnProcessIdMessages[proc.bpmnProcessId]) {
        let clone = Object.assign({}, caseMgmtConf);
        clone.bpmnProcessIdMessages[proc.bpmnProcessId] = [];
        setCaseMgmtConf(clone);
      }

      document.getElementById('diagramViewer')!.innerHTML = "";
      let viewer = new NavigatedViewer({
        container: document.getElementById('diagramViewer'),
        height: 300
      });
      setViewer(viewer);
      viewer.importXML(xml).then((result: any) => {
        const eltRegistry: any = viewer!.get('elementRegistry');
        eltRegistry.forEach((elt: any) => {
          if (elt.type == "bpmn:BoundaryEvent" && elt.businessObject.eventDefinitions && elt.businessObject.eventDefinitions[0].$type == "bpmn:MessageEventDefinition") {
            let hosts = [elt.host.id];
            if (elt.host.type == "bpmn:SubProcess") {
              hosts = [];
              for (let i = 0; i<elt.host.children.length; i++) {
                if (elt.host.children[i].type == "bpmn:UserTask") {
                  hosts.push(elt.host.children[i].id);
                }
              }
            }
            console.log(elt);
            console.log(hosts);
            let conf = addMessageConfIfRequired(elt, hosts);
            if (conf.enabled) {
              colorActivity(viewer, elt.id, "#33CC66");
            } else {
              colorActivity(viewer, elt.id, "#993333");
            }
            setMessageConf(elt.businessObject.eventDefinitions[0].messageRef.name);
          }

          if (elt.type == "bpmn:StartEvent" &&
            elt.businessObject.eventDefinitions && elt.businessObject.eventDefinitions[0].$type == "bpmn:MessageEventDefinition" &&
            elt.businessObject.$parent.$type == "bpmn:SubProcess") {
            let conf = addMessageConfIfRequired(elt, null);
            if (conf.enabled) {
              colorActivity(viewer, elt.id, "#33CC66");
            } else {
              colorActivity(viewer, elt.id, "#993333");
            }
            setMessageConf(elt.businessObject.eventDefinitions[0].messageRef.name);
          }
        });
      });
    }
  }, [xml]);


  const colorActivity = (viewer: any, id: string, color: string) => {
    const elementRegistry = viewer.get('elementRegistry');
    const graphicsFactory = viewer.get('graphicsFactory');
    const element = elementRegistry.get(id);
    if (element?.di !== undefined) {
      element.di.set('stroke', color);

      const gfx = elementRegistry?.getGraphics(element);
      if (gfx !== undefined) {
        graphicsFactory?.update('connection', element, gfx);
      }
    }
  };

  const update = (index: number, attribute: string, value: any) => {
    let clone = Object.assign({}, caseMgmtConf);
    clone.bpmnProcessIdMessages[proc!.bpmnProcessId][index][attribute] = value;
    saveConf(clone);
    if (attribute == "enabled") {
      if (value) {
        colorActivity(viewer, clone.bpmnProcessIdMessages[proc!.bpmnProcessId][index].id, "#33CC66")
      } else {
        colorActivity(viewer, clone.bpmnProcessIdMessages[proc!.bpmnProcessId][index].id, "#993333")
      }
    }
  }

  const saveConf = (conf: any) => {
    api.post('/casemgmt', conf).then((response: any) => {
      setCaseMgmtConf(response.data);

    }).catch((error: any) => {
      alert(error.message);
    });
  }

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
            <>
              <div id="diagramViewer"></div>

              <div className="tab-pane">
                <div className="d-flex align-items-start">
                  <div className="nav flex-column nav-pills me-3" role="tablist">
                    {proc && caseMgmtConf && caseMgmtConf.bpmnProcessIdMessages[proc.bpmnProcessId] && caseMgmtConf.bpmnProcessIdMessages[proc.bpmnProcessId].map((conf: any) =>
                      <button className={conf.id == messageConf ? "nav-link active" : "nav-link"} role="tab" onClick={() => setMessageConf(conf.id)}> {conf.name} ({conf.message})</button>
                    )}
                  </div>
                  <div className="tab-content" id="v-pills-tabContent">
                    {proc && caseMgmtConf && caseMgmtConf.bpmnProcessIdMessages[proc.bpmnProcessId] && caseMgmtConf.bpmnProcessIdMessages[proc.bpmnProcessId].map((conf: any, index: number) =>
                      <div className={conf.id == messageConf ? "tab-pane fade show active" : "tab-pane fade"}>

                        <Form.Check
                          type="switch" checked={conf.enabled} onChange={(evt) => update(index, 'enabled', evt.target.checked)}
                          label="Display the instance page" />

                        <InputGroup className="mb-3">
                          <InputGroup.Text>Message</InputGroup.Text>
                          <Form.Control value={conf.message} readOnly />
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroup.Text>CorrelationKey</InputGroup.Text>
                          <Form.Control value={conf.correlationKey} readOnly />
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroup.Text>Name</InputGroup.Text>
                          <Form.Control value={conf.name} onChange={(evt) => update(index, 'name', evt.target.value)} />
                        </InputGroup>
                        {conf.elementIds ?
                          <InputGroup className="mb-3">
                            <InputGroup.Text>ElementIds</InputGroup.Text>
                            <Form.Control value={conf.elementIds} readOnly />
                          </InputGroup> : <></>}
                        <InputGroup className="mb-3">
                          <InputGroup.Text>FormKey</InputGroup.Text>
                          <Form.Control value={conf.formKey} onChange={(evt) => update(index, 'formKey', evt.target.value)} />
                        </InputGroup>
                      </div >
                    )}
                  </div>
                </div>
              </div></>
            : <></>}
        </div>
      </main>
    </div>
  );
}

export default CaseManagement;
