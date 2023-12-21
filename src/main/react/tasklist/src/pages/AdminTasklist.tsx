import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import taskService from '../service/TaskService';
import { Form, InputGroup, Table, Button, Row, Col } from 'react-bootstrap';

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

  return (
    tasklistConf ?
      <>
        <InputGroup className="mb-1">
          <Form.Check
            type="switch" checked={tasklistConf.splitPage} onChange={(evt) => update('splitPage', evt.target.checked)}
            label="Tasklist page also display the task (split mode)" />
        </InputGroup>

        <h4>Default Filters</h4>
        <InputGroup className="mb-1">
          <Form.Check
            type="switch" checked={tasklistConf.defaultFilters.state} onChange={(evt) => updateSub('defaultFilters', 'state', evt.target.checked)}
            label="Filter on state" />
        </InputGroup>
        <InputGroup className="mb-1">
          <Form.Check
            type="switch" checked={tasklistConf.defaultFilters.assigned} onChange={(evt) => updateSub('defaultFilters', 'assigned', evt.target.checked)}
            label="Filter on assignment" />
        </InputGroup>
        {tasklistConf.defaultFilters.assigned ?
          <>
            <InputGroup className="mb-1">
              <Form.Check
                type="switch" checked={tasklistConf.defaultFilters.assignee} onChange={(evt) => updateSub('defaultFilters', 'assignee', evt.target.checked)}
                label="Filter on assignee" />
            </InputGroup>
            <InputGroup className="mb-1">
              <Form.Check
                type="switch" checked={tasklistConf.defaultFilters.group} onChange={(evt) => updateSub('defaultFilters', 'group', evt.target.checked)}
                label="Filter on group" />
            </InputGroup>
          </>
          : <></>
        }

        <h4>Variables Filters</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Variable</th>
              <th>Type</th>
              <th>values</th>
              <th><Button variant="success" onClick={addVariableFilters}><i className="bi bi-plus-circle"></i></Button></th>
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
                  {filter.variable && filter.variable =="customValue" ?
                    <Form.Control value={filter.customVariable} onChange={(evt) => changeFilterCustomVariable(index, evt.target.value)} />
                  :<></>}
                </td>
                <td><Form.Select value={filter.type} onChange={(evt) => changeFilterType(index, evt.target.value)}>
                  <option value="list">list</option>
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
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
        </Table>
      </>
      : <></>
  );
}

export default AdminTasklist;
