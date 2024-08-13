import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../service/api';
import TaskForm from '../components/TaskForm';
import authService from '../service/AuthService';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import moment from "moment";

import { useTranslation } from "react-i18next";
import InstanceView from '../components/InstanceView';

function Instances() {
  const [instance, setInstance] = useState<any>(null);
  const [pagination, setPagination] = useState<any>({ "page": 0, "pageSize":10 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [instances, setInstances] = useState<any>(null);
  const [state, setState] = useState("ACTIVE");
  const tasklistConf = useSelector((state: any) => state.process.tasklistConf);
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
    const newPagination = { "page": pagination.page + 1, "pageSize": pagination.pageSize, "after": instances[instances.length-1].key };
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

  return (
    instances && tasklistConf && tasklistConf.instancesColumns ?
      <Row>
      <Col className="tasklist ps-md-2 pt-2">
          <InputGroup className="mb-3">
            <InputGroup.Text>{t("State")}</InputGroup.Text>
            <Form.Select aria-label="state" value={state} onChange={(evt) => setState(evt.target.value)}>
              <option value="ACTIVE" >{t("Created")}</option>
              <option value="COMPLETED">{t("Completed")}</option>
              <option value="CANCELED">{t("Canceled")}</option>
            </Form.Select>
          </InputGroup>
        <Table striped hover variant="light" className="taskListContainer">
          <thead >
            <tr >
                {tasklistConf.instancesColumns.map((column: any, index: number) =>
                <th className="bg-primary text-light" key={index}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
              {instances.map((instance: any) =>
                <tr key={instance.key} onClick={() => setInstance(instance)}>{tasklistConf.instancesColumns.map((column: any, index: number) =>
                  <td key={index}>{display(instance, column)}
                  </td>)}</tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={tasklistConf.instancesColumns.length} >
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
          {instance ?
            <InstanceView instancekey={instance.key} processDefinitionKey={instance.processDefinitionKey} variables={instance.variables}/>
            : <></>}
        </Col>
      
      </Row>
      : <></>
  );
}

export default Instances;
