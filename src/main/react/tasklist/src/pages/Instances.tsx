import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../service/api';
import processService from '../service/ProcessService';

import { Table, ButtonGroup, Row, Col, Modal, InputGroup, Form, Button, Dropdown } from 'react-bootstrap';
import moment from "moment";

import { useTranslation } from "react-i18next";
import InstanceView from '../components/InstanceView';
import CaseMgmtComponent from '../components/CaseMgmtComponent';
import InstantiationForm from '../components/InstantiationForm';

function Instances() {
  const [instance, setInstance] = useState<any>(null);
  const [pagination, setPagination] = useState<any>({ "page": 0, "pageSize":10 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [instances, setInstances] = useState<any[]|null>(null);
  const [state, setState] = useState("ACTIVE");
  const tasklistConf = useSelector((state: any) => state.process.tasklistConf);
  const [messagesConf, setMessagesConf] = useState<any>(null);
  const [checkedInstances, setCheckedInstances] = useState<any[]>([]);
  const [newInstance, setNewInstance] = useState<boolean>(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (tasklistConf && tasklistConf.instancesBpmnProcessId) {
      api.get<any>('/casemgmt/messages/' + tasklistConf.instancesBpmnProcessId).then(response => {
        setMessagesConf(response.data);
      }).catch(error => {
        alert(error.message);
      });
    }
  }, [tasklistConf]);


  const loadInstance = async (pagination: any) => {
    setLoading(true);

    let paging = "?pageSize=" + pagination.pageSize;
    if (pagination.page > 0) {
      if (pagination.after) {
        paging += "&after=" + pagination.after;
      }
    }
    api.get('/instances/' + tasklistConf.instancesBpmnProcessId + '/' + state + paging).then((response: any) => {
      setInstances(response.data.items);
      setResult(response.data);
      setLoading(false);
    }).catch((error:any) => {
      alert(error.message);
    })
  }

  const before = () => {
    const newPagination = { "page": 0, "pageSize": pagination.pageSize };
    setPagination(newPagination)
    loadInstance(newPagination);
  }
  const after = () => {
    const newPagination = { "page": pagination.page + 1, "pageSize": pagination.pageSize, "after": instances![instances!.length-1].key };
    setPagination(newPagination)
    loadInstance(newPagination);
  }
  function changePageSize(pageSize:number) {
    const newPagination = Object.assign({}, pagination);
    newPagination.pageSize= pageSize;

    setPagination(newPagination)
    loadInstance(newPagination);
  }

  useEffect(() => {
    loadInstance(pagination);
  }, [state]);


  const display = (instance: any, column: any): string => {
    let key = column.value;
    if (key == "customValue") {
      key = column.customValue;
    }
    let value = "";
    if (column.variable) {
      value = result.variables[instance.key][key];
    } else {
      value = instance[key];
    }
    if (column.type == "date" && tasklistConf.formatDate && tasklistConf.formatDate != "") {
      return moment(value).format(tasklistConf.formatDate);
    }
    if (column.type == "dateTime" && tasklistConf.formatDate && tasklistConf.formatDate != "") {
      return moment(value).format(tasklistConf.formatDatetime);
    }
    if (column.type == "object") {
      return JSON.stringify(value);
    }
    return value;
  }

  const selectInstance = (index: number, checked: boolean) => {
    let clone = JSON.parse(JSON.stringify(instances));
    clone[index].checked = checked;
    let checkedInst = [];
    for (let i = 0; i < clone.length; i++) {
      if (clone[i].checked) {
        checkedInst.push(clone[i]);
      }
    }
    setCheckedInstances(checkedInst);
    console.log(checkedInst);
    setInstances(clone);
  }

  const selectAll = (checked: boolean) => {
    let clone = JSON.parse(JSON.stringify(instances));
    for (let i = 0; i < clone.length; i++) {
      clone[i].checked = checked;
    }
    if (checked) {
      setCheckedInstances(clone);
    } else {
      setCheckedInstances([]);
    }
    setInstances(clone);
  }

  const openProcess = () => {
    dispatch(processService.setProcessById(tasklistConf.instancesBpmnProcessId));
    setNewInstance(true);
  }

  const openInstance = (instance: any) => {
    setNewInstance(false);
    setInstance(instance);
  }

  return (
    instances && tasklistConf && tasklistConf.instancesColumns ?
      <Row>
        <Col className="tasklist ps-md-2 pt-2">
          <Button variant="outline-primary" onClick={openProcess} className="mb-2"> <i className="bi bi-send"></i> New case</Button>
          <InputGroup className="mb-3">
            <InputGroup.Text>{t("State")}</InputGroup.Text>
            <Form.Select aria-label="state" value={state} onChange={(evt) => setState(evt.target.value)}>
              <option value="ACTIVE" >{t("Created")}</option>
              <option value="COMPLETED">{t("Completed")}</option>
              <option value="CANCELED">{t("Canceled")}</option>
            </Form.Select>
          </InputGroup>
          {checkedInstances.length > 0 ?
            <CaseMgmtComponent type="multiInstances" taskEltId={null} bpmnProcessId={tasklistConf.instancesBpmnProcessId} processInstanceKey={0} instances={checkedInstances} processDefinitionKey={null} variables={{}} redirect="/tasklist/instances" />
            :<></>
}
        <Table striped hover variant="light" className="taskListContainer">
          <thead >
              <tr >
                 <th className="bg-primary text-light"><Form.Check onChange={(event: any) => selectAll(event.target.checked)}/></th>
                {tasklistConf.instancesColumns.map((column: any, index: number) =>
                <th className="bg-primary text-light" key={index}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
              {instances.map((instance: any, indexInstance: number) =>
                <tr key={instance.key} >
                  <td><Form.Check checked={instance.checked} onChange={(event: any) => selectInstance(indexInstance, event.target.checked)} /></td>
                  {tasklistConf.instancesColumns.map((column: any, index: number) =>
                    <td key={index} onClick={() => openInstance(instance)}>{display(instance, column)}
                  </td>)}</tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={tasklistConf.instancesColumns.length+1} >
                  <div className="pagination">
                    <Button variant="outline-primary" onClick={before} disabled={loading}><i className="bi bi-arrow-left"></i> First page</Button>
                    <div className="taskListFilter bg-lightgreen text-light">

                      <div className="text-primary">
                        {t("Show")} &nbsp;
                        <select value={pagination.pageSize} onChange={(evt) => changePageSize(evt.target.value as unknown as number)} disabled={loading}>
                          <option>5</option>
                          <option>10</option>
                          <option>20</option>
                          <option>50</option>
                        </select> &nbsp;
                        {t("results")}
                      </div>
                    </div>
                    <Button variant="outline-primary" onClick={after} disabled={loading}>after <i className="bi bi-arrow-right"></i> </Button>
                  </div>
                </td></tr>
            </tfoot>
        </Table>
      </Col>

        <Col className="ps-md-2 pt-2">
          {newInstance ?
            <div className="taskListFormContainer">
              <InstantiationForm />
            </div>
            : instance ?
            <InstanceView instancekey={instance.key} processDefinitionKey={instance.processDefinitionKey} variables={result.variables[instance.key]}/>
            : <></>}
        </Col>
      
      </Row>
      : <></>
  );
}

export default Instances;
