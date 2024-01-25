import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import taskService from '../service/TaskService';
import { Form, InputGroup, Table, Button, Row, Col, Accordion } from 'react-bootstrap';

function AdminTasklist() {


  const tasklistConf = useSelector((state: any) => state.process.tasklistConf)
  const [variables, setVariables] = useState<any>();
  const [variableNames, setVariableNames] = useState<string[]>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(taskService.loadTasklistConf());
    loadVars();
  }, []);

  const loadVars = async () => {
    const filterVariables = await taskService.listVariables();
    setVariables(filterVariables);
    let variableNames = [];
    for (const attribute in filterVariables) {
      variableNames.push(attribute);
    }
    variableNames.sort();
    setVariableNames(variableNames);
  }

  const update = (property: string, value: any) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone[property] = value;
    dispatch(taskService.saveTasklistConf(clone));
  }
  const updateSub = (property: string, property2: string, value: any) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone[property][property2] = value;
    dispatch(taskService.saveTasklistConf(clone));
  }
  const addVariableFilters = () => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.variablesFilters.push({ "variable": "customValue", "type": "string" });
    dispatch(taskService.saveTasklistConf(clone));
  }
  const deleteFilters = (index: number) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.variablesFilters.splice(index, 1);
    dispatch(taskService.saveTasklistConf(clone));
  }
  const changeFilterVariable = (index: number, value: string) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.variablesFilters[index].variable = value;
    if (value == "customValue") {
      clone.variablesFilters[index].customVariable = "custom";
      clone.variablesFilters[index].type = "string";
      clone.variablesFilters[index].values = [];
    } else {
      clone.variablesFilters[index].customVariable = value;
      clone.variablesFilters[index].type = "list";
      clone.variablesFilters[index].values = variables![value];
      for (let i = 0; i < clone.variablesFilters[index].values.length; i++) {
        let variable = clone.variablesFilters[index].values[i];
        if (typeof variable === 'object' && variable !== null) {
          clone.variablesFilters[index].values[i] = JSON.stringify(variable);
        }
      }
    }
    dispatch(taskService.saveTasklistConf(clone));
  }
  const changeFilterCustomVariable = (index: number, value: string) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.variablesFilters[index].customVariable = value;
    dispatch(taskService.saveTasklistConf(clone));
  }

  const changeFilterType = (index: number, value: string) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.variablesFilters[index].type = value;
    dispatch(taskService.saveTasklistConf(clone));
  }
  const changeFilterValue = (index: number, index2: number, value: string) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.variablesFilters[index].values[index2] = value;
    dispatch(taskService.saveTasklistConf(clone));
  }

  const deleteFilterValue = (index: number, index2: number) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.variablesFilters[index].values.splice(index2, 1);
    dispatch(taskService.saveTasklistConf(clone));
  }

  const addFilterValue = (index: number) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.variablesFilters[index].values.push("");
    dispatch(taskService.saveTasklistConf(clone));
  }

  const addColumn = () => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.columns.push({ "label": "Column header", "value": "id", "type": "number" });
    dispatch(taskService.saveTasklistConf(clone));
  }
  const changeColumn = (index: number, attribute: string, value: any) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.columns[index][attribute] = value;
    if (attribute == "variable") {
      if (value) {
        clone.columns[index].value = variableNames![0];
      } else {
        clone.columns[index].value = "id";
      }

    }
    dispatch(taskService.saveTasklistConf(clone));
  }
  const deleteColumn = (index: number) => {
    let clone = JSON.parse(JSON.stringify(tasklistConf));
    clone.columns.splice(index, 1);
    dispatch(taskService.saveTasklistConf(clone));
  }

  return (
    tasklistConf ?
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Basic configuration</Accordion.Header>
          <Accordion.Body>
            <Form.Check
              type="switch" checked={tasklistConf.splitPage} onChange={(evt) => update('splitPage', evt.target.checked)}
              label="Tasklist page also display the task (split mode)" />

            <Form.Check
              type="switch" checked={tasklistConf.filterOnAssignee} onChange={(evt) => update('filterOnAssignee', evt.target.checked)}
              label="Tasks automatically filtered on assignee" />

            <InputGroup className="mb-3">
              <InputGroup.Text>Date format</InputGroup.Text>
              <Form.Control value={tasklistConf.formatDate} onChange={(evt) => update('formatDate', evt.target.value)} />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Date Time format</InputGroup.Text>
              <Form.Control value={tasklistConf.formatDatetime} onChange={(evt) => update('formatDatetime', evt.target.value)} />
            </InputGroup>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Default Filters</Accordion.Header>
          <Accordion.Body>
            <Form.Check
              type="switch" checked={tasklistConf.defaultFilters.state} onChange={(evt) => updateSub('defaultFilters', 'state', evt.target.checked)}
              label="Filter on state" />

            <Form.Check
              type="switch" checked={tasklistConf.defaultFilters.assigned} onChange={(evt) => updateSub('defaultFilters', 'assigned', evt.target.checked)}
              label="Filter on assignment" />

            {tasklistConf.defaultFilters.assigned ?
              <>
                <Form.Check
                  type="switch" checked={tasklistConf.defaultFilters.assignee} onChange={(evt) => updateSub('defaultFilters', 'assignee', evt.target.checked)}
                  label="Filter on assignee" />
                <Form.Check
                  type="switch" checked={tasklistConf.defaultFilters.group} onChange={(evt) => updateSub('defaultFilters', 'group', evt.target.checked)}
                  label="Filter on group" />
              </>
              : <></>
            }
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Variables Filters</Accordion.Header>
          <Accordion.Body>
            <Table striped bordered hover variant="primary">
              <thead>
                <tr>
                  <th><Button variant="success" onClick={addVariableFilters}><i className="bi bi-plus-circle"></i></Button></th>
                  <th>Variable</th>
                  <th>Type</th>
                  <th>values</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tasklistConf.variablesFilters ? tasklistConf.variablesFilters.map((filter: any, index: number) =>
                  <tr key={index}>
                    <td>{index}</td>
                    <td>
                      <Form.Select value={filter.variable} onChange={(evt) => changeFilterVariable(index, evt.target.value)}>
                        <option value="customValue">-- Custom value --</option>
                        {variableNames ? variableNames.map((filterVariable: string, index2: number) =>
                          <option key={index2} value={filterVariable}>{filterVariable}</option>
                        ) : <></>}
                      </Form.Select>
                      {filter.variable && filter.variable == "customValue" ?
                        <Form.Control value={filter.customVariable} onChange={(evt) => changeFilterCustomVariable(index, evt.target.value)} />
                        : <></>}
                    </td>
                    <td><Form.Select value={filter.type} onChange={(evt) => changeFilterType(index, evt.target.value)}>
                      <option value="list">list</option>
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                      <option value="object">object</option>
                    </Form.Select></td>
                    <td>
                      {filter.type && filter.type == "list" ?
                        <>
                          <Button variant="success" onClick={() => addFilterValue(index)}><i className="bi bi-plus-circle"></i></Button>
                          {filter.values ? filter.values.map((filterValue: any, index3: number) =>
                            <Row key={index3}>
                              <Col>
                                <Button variant="danger" onClick={() => deleteFilterValue(index, index3)}><i className="bi bi-trash"></i></Button>
                              </Col>
                              <Col>
                                <Form.Control key={index3} value={filterValue} onChange={(evt) => changeFilterValue(index, index3, evt.target.value)} />
                              </Col>
                            </Row>
                          ) : <></>
                          }
                        </>
                        : <></>}
                    </td>
                    <td><Button variant="danger" onClick={() => deleteFilters(index)}><i className="bi bi-trash"></i></Button></td>
                  </tr>
                ) : <></>}
              </tbody>
            </Table></Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Columns</Accordion.Header>
          <Accordion.Body>
            <Table striped bordered hover variant="primary">
              <thead>
                <tr>
                  <th><Button variant="success" onClick={addColumn}><i className="bi bi-plus-circle"></i></Button></th>
                  <th>Column Label</th>
                  <th>What to display</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tasklistConf.columns ? tasklistConf.columns.map((column: any, index: number) =>
                  <tr key={index}>
                    <td>{index}</td>
                    <td>
                      <Form.Control value={column.label} onChange={(evt) => changeColumn(index, 'label', evt.target.value)} />
                    </td>
                    <td>
                      <Form.Check
                        type="switch" checked={column.variable} onChange={(evt) => changeColumn(index, 'variable', evt.target.checked)}
                        label="Display a variable" />
                      {column.variable ?
                        <>
                          <Form.Select value={column.value} onChange={(evt) => changeColumn(index, 'value', evt.target.value)}>
                            <option value="customValue">-- Custom value --</option>
                            {variableNames ? variableNames.map((filterVariable: string, index2: number) =>
                              <option key={index2} value={filterVariable}>{filterVariable}</option>
                            ) : <></>}
                          </Form.Select>
                          {column.value && column.value == "customValue" ?
                            <Form.Control value={column.customValue} onChange={(evt) => changeColumn(index, 'customValue', evt.target.value)} />
                            : <></>}
                        </>
                        :
                        <Form.Select value={column.value} onChange={(evt) => changeColumn(index, 'value', evt.target.value)}>
                          <option value="id">Task Id</option>
                          <option value="name">Task Name</option>
                          <option value="processName">Process Name</option>
                          <option value="creationDate">Creation Date</option>
                          <option value="assignee">Assignee</option>
                          <option value="candidateGroups">Candidate groups</option>
                          <option value="taskState">Task state</option>
                          <option value="formKey">Form key</option>
                          <option value="processDefinitionKey">Process definition key</option>
                        </Form.Select>
                      }
                    </td>
                    <td>
                      <Form.Select value={column.type} onChange={(evt) => changeColumn(index, 'type', evt.target.value)}>
                        <option value="number">Number</option>
                        <option value="string">String</option>
                        <option value="date">Date</option>
                        <option value="dateTime">Date Time</option>
                        <option value="list">List</option>
                        <option value="object">object</option>
                      </Form.Select>

                    </td>
                    <td><Button variant="danger" onClick={() => deleteColumn(index)}><i className="bi bi-trash"></i></Button></td>
                  </tr>
                ) : <></>}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      : <></>
  );
}

export default AdminTasklist;
