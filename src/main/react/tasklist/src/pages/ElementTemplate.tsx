import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modeler from 'camunda-bpmn-js/lib/camunda-cloud/Modeler';
import Accordion from 'react-bootstrap/Accordion';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import eltTemplateService from '../service/EltTemplateService';
import { useTranslation } from "react-i18next";

function ElementTemplate() {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.auth.data)
  const diagramContainer = React.useRef<HTMLInputElement>(null);
  const panelContainer = React.useRef<HTMLInputElement>(null);
  let task = { "current": null };
  const [modeler, setModeler] = useState<any>(null);
  const [connector, setConnector] = useState<string | null>(null);
  const [templateValue, setTemplateValue] = useState<any | null>(null);


  const update = (property: string, value: any) => {
    let copy = Object.assign({}, templateValue);
    copy[property] = value;
    setTemplateValue(copy);
  }
  const updateNumber = (property: string, value: any) => {
    update(property, value * 1);
  }
  const updateElementType = (value: string) => {
    let copy = Object.assign({}, templateValue);
    copy.elementType.value = value;
    setTemplateValue(copy);
  }

  const loadIcon = (evt: any) => {
    var file = evt.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let copy = Object.assign({}, templateValue);
        copy.icon.contents = reader.result;
        setTemplateValue(copy);
      };

    }
  }
  const addGroup = () => {
    let copy = Object.assign({}, templateValue);
    if (!copy.groups) {
      copy.groups = [];
    }
    copy.groups.push({
      "id": "group" + (copy.groups.length + 1),
      "label": "Group " + (copy.groups.length + 1)
    });
    setTemplateValue(copy);
  }
  const addProperty = () => {
    let copy = Object.assign({}, templateValue);
    if (!copy.groups || copy.groups.length == 0) {
      copy.groups = [{
        "id": "group0",
        "label": "Group 0"
      }];
    }
    copy.properties.push(
      {
        "label": "A new property",
        "description": "With some description",
        "group": copy.groups[0].id,
        "type": "String",
        "feel": "optional",
        "binding": {
          "type": "zeebe:input",
          "name": "inputName"
        },
        "optional": true
      });
    setTemplateValue(copy);
  }
  const deleteGroup = (index: number) => {
    let copy = Object.assign({}, templateValue);
    copy.groups.splice(index, 1);
    setTemplateValue(copy);
  }
  const updateGroup = (index: number, property: string, value: string) => {
    let copy = Object.assign({}, templateValue);
    copy.groups[index][property] = value;
    setTemplateValue(copy);
  }
  const updateInput = (index: number, property: string, value: string) => {
    let copy = Object.assign({}, templateValue);
    if (value == "setGroupNull") {
      delete copy.properties[index][property];
    } else {
      copy.properties[index][property] = value;
    }
    if (copy.properties[index].type != 'String' && copy.properties[index].type != 'Text' && copy.properties[index].feel) {
      delete copy.properties[index].feel;
    }
    if (copy.properties[index].type != 'Dropdown' && copy.properties[index].choices) {
      delete copy.properties[index].choices;
    }
    if (copy.properties[index].type == 'Dropdown' && !copy.properties[index].choices) {
      copy.properties[index].choices = [];
    }
    setTemplateValue(copy);
  }
  const deleteInput = (index: number) => {
    let copy = Object.assign({}, templateValue);
    copy.properties.splice(index, 1);
    setTemplateValue(copy);
  }

  const updateInputBinding = (index: number, property: string, value: string) => {
    let copy = Object.assign({}, templateValue);
    if (property == 'type') {
      if (value == 'zeebe:taskHeader' && !copy.properties[index].binding.key) {
        if (copy.properties[index].binding.name) {
          copy.properties[index].binding.key = copy.properties[index].binding.name;
          delete copy.properties[index].binding.name;
        } else if (copy.properties[index].binding.source) {
          copy.properties[index].binding.key = copy.properties[index].binding.source;
          delete copy.properties[index].binding.source;
        }
      }
      if ((value == 'zeebe:input' || value == 'zeebe:property') && !copy.properties[index].binding.name) {
        if (copy.properties[index].binding.key) {
          copy.properties[index].binding.name = copy.properties[index].binding.key;
          delete copy.properties[index].binding.key;
        } else if (copy.properties[index].binding.source) {
          copy.properties[index].binding.name = copy.properties[index].binding.source;
          delete copy.properties[index].binding.source;
        }
      }
      if (value == 'zeebe:output' && !copy.properties[index].binding.source) {
        if (copy.properties[index].binding.key) {
          copy.properties[index].binding.source = copy.properties[index].binding.key;
          delete copy.properties[index].binding.key;
        } else if (copy.properties[index].binding.name) {
          copy.properties[index].binding.source = copy.properties[index].binding.name;
          delete copy.properties[index].binding.name;
        }
      }
    }
    copy.properties[index].binding[property] = value;

    setTemplateValue(copy);
  }

  const updatePattern = (index: number, property: string, value: string) => {
    let copy = Object.assign({}, templateValue);
    copy.properties[index].pattern[property] = value;
    setTemplateValue(copy);
  }
  const addInputChoice = (index: number) => {
    let copy = Object.assign({}, templateValue);
    copy.properties[index].choices.push({
      "name": "choice" + (copy.properties[index].choices.length + 1),
      "value": "choice " + (copy.properties[index].choices.length + 1)
    });
    setTemplateValue(copy);
  }
  const deleteInputChoice = (index: number, indexChoice: number) => {
    let copy = Object.assign({}, templateValue);
    copy.properties[index].choices.splice(indexChoice, 1);
    setTemplateValue(copy);
  }
  const updateInputChoice = (index: number, indexChoice: number, property: string, value: string) => {
    let copy = Object.assign({}, templateValue);
    copy.properties[index].choices[indexChoice][property] = value;
    setTemplateValue(copy);
  }
  const swicthOptional = (index: number, value: boolean) => {
    let copy = Object.assign({}, templateValue);
    if (value) {
      copy.properties[index].optional = true;
    } else {
      delete copy.properties[index].optional;
    }
    setTemplateValue(copy);
  }

  const listPropsIds = (): Array<string> => {
    let result = []
    for (let i = 0; i < templateValue.properties.length; i++) {
      if (templateValue.properties[i].id) {
        result.push(templateValue.properties[i].id);
      }
    }
    return result;
  }

  const swicthCondition = (index: number, value: boolean) => {
    let listIds = listPropsIds();

    let copy = Object.assign({}, templateValue);
    if (value) {
      if (listIds.length == 0) {
        alert("You need to defined the id of at least one property to use it in a condition.");
      } else {
        copy.properties[index].condition = {
          "property": listIds[0],
          "equals": "something"
        };
      }
    } else {
      delete copy.properties[index].condition;
    }
    setTemplateValue(copy);
  }

  const swicthConstraints = (index: number, value: boolean) => {
    let copy = Object.assign({}, templateValue);
    if (value) {
      copy.properties[index].constraints = {};
    } else {
      delete copy.properties[index].constraints;
    }
    setTemplateValue(copy);
  }

  const swicthNotEmpty = (index: number, value: boolean) => {
    let copy = Object.assign({}, templateValue);
    if (value) {
      copy.properties[index].constraints.notEmpty = true;
    } else {
      delete copy.properties[index].constraints.notEmpty;
    }
    setTemplateValue(copy);
  }

  const swicthPattern = (index: number, value: boolean) => {
    let copy = Object.assign({}, templateValue);
    if (value) {
      copy.properties[index].constraints.pattern = {
        "value": "^([0-9]*$)|(somePrefix.*$)",
        "message": "Should respect pattern"
      };
    } else {
      delete copy.properties[index].constraints.pattern;
    }
    setTemplateValue(copy);
  }

  const updateInputCondition = (index: number, value: string) => {
    let copy = Object.assign({}, templateValue);
    copy.properties[index].condition.property = value;
    setTemplateValue(copy);
  }
  const updateInputConditionType = (index: number, value: string) => {
    let copy = Object.assign({}, templateValue);
    if (value == "equals") {
      copy.properties[index].condition.equals = "";
      delete copy.properties[index].condition.oneOf;
    } else {
      copy.properties[index].condition.oneOf = [];
      delete copy.properties[index].condition.equals;
    }
    setTemplateValue(copy);
  }
  const updateInputConditionValue = (index: number, value: string) => {
    let copy = Object.assign({}, templateValue);
    copy.properties[index].condition.equals = value;
    setTemplateValue(copy);
  }


  const addInputConditionChoice = (index: number) => {
    let copy = Object.assign({}, templateValue);
    copy.properties[index].condition.oneOf.push("");
    setTemplateValue(copy);
  }
  const deleteInputConditionChoice = (index: number, indexChoice: number) => {
    let copy = Object.assign({}, templateValue);
    copy.properties[index].condition.oneOf.splice(indexChoice, 1);
    setTemplateValue(copy);
  }
  const updateInputConditionChoice = (index: number, indexChoice: number, value: string) => {
    let copy = Object.assign({}, templateValue);
    copy.properties[index].condition.oneOf[indexChoice] = value;
    setTemplateValue(copy);
  }
  const download = () => {

    let url = window.URL.createObjectURL(new Blob([JSON.stringify(templateValue, null, 2)], { type: "application/json" }));
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = templateValue.name + ".json";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();

  }
  const loadEltTemplate = async () => {
    let url = window.location.href;
    let lastElt = url.substring(url.lastIndexOf("/") + 1, url.length);
    if (lastElt != '' && lastElt != 'elementTemplate') {
      setConnector(lastElt);
      setTemplateValue(await eltTemplateService.getEltTemplate(lastElt));
    }
  }

  const buildModeler = () => {
    if (panelContainer.current?.hasChildNodes()) {
      panelContainer.current?.removeChild(panelContainer.current.children[0]);
    }
    if (diagramContainer.current?.hasChildNodes()) {
      diagramContainer.current?.removeChild(diagramContainer.current.children[0]);
    }
    setModeler(
      new Modeler({
        container: diagramContainer.current,
        propertiesPanel: {
          parent: panelContainer.current
        }
      })
    );
  }

  useEffect(() => {
    if (templateValue == null) {
      loadEltTemplate();
    }
    buildModeler();
  }, []);

  // initially select the task to put properties panel preview in correct state
  useEffect(() => {
    if (modeler) {
      modeler.get('eventBus').once('propertiesPanel.layoutChanged', () => {
        // wait for properties panel effect hooks to complete before selecting task
        setTimeout(() => modeler.get('selection').select(task.current, true), 0);
      });
    }
  }, [modeler]);

  // update properties panel whenever value changes
  useEffect(() => {
    if (modeler && templateValue) {
      try {
        //const connectorTemplateDefinition = JSON.parse(templateValue);
        const connectorTemplateDefinition: any = templateValue;
        modeler.invoke([
          'elementTemplatesLoader',
          'elementTemplates',
          'elementFactory',
          'bpmnFactory',
          'modeling',
          'canvas',
          'selection',
          (elementTemplatesLoader: any, elementTemplates: any, elementFactory: any, bpmnFactory: any, modeling: any, canvas: any, selection: any) => {
            elementTemplatesLoader.setTemplates([connectorTemplateDefinition]);

            const connectorTemplate = elementTemplates.get(
              connectorTemplateDefinition.id,
              connectorTemplateDefinition.version
            );

            if (!connectorTemplate) {
              // invalid template
              return;
            }

            const type =
              (connectorTemplate.elementType && connectorTemplate.elementType.value) || connectorTemplate.appliesTo[0];

            modeler.importXML(BPMN_XML).then(() => {
              try {

                task.current = modeling.createElements(
                  [
                    elementFactory.create('shape', {
                      type: type,
                      businessObject: bpmnFactory.create(type, {
                        name: type.replace('bpmn:', '')
                      })
                    })
                  ],
                  { x: 200, y: 200 },
                  canvas.getRootElement()
                )[0];

                elementTemplates.applyTemplate(task.current, connectorTemplate);

                selection.select(task.current, true);
              } catch (e) {
                // invalid task type specified
              }
            });
          }
        ]);
      } catch (e) {
        // invalid json specified
      }
    }
  }, [templateValue, modeler]);

  const BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="9.0.3">
  <process id="Process_1" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</definitions> `


  return (
   
      <div className="elementTemplate">
      <div className="templateEditor">
        {templateValue ? <>
          {user.profile == 'Admin' ?
            <Button variant="primary" onClick={(evt) => eltTemplateService.saveTemplate(connector, templateValue)} className="saveTemplate"><i className="bi bi-save"></i> {t("Save")}</Button>
            :
            <></>
          }
            <Button variant="primary" onClick={(evt) => download()} className="downloadJson"><i className="bi bi-download"></i> JSON</Button>
      <Tabs defaultActiveKey="general">
        <Tab eventKey="general" title="General">
          <InputGroup className="mb-3">
            <InputGroup.Text>Name</InputGroup.Text>
            <Form.Control aria-label="Name" readOnly={true} value={templateValue.name} />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Type</InputGroup.Text>
            <Form.Control aria-label="Type" readOnly={true} value={templateValue.properties[0].value} />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Description</InputGroup.Text>
            <Form.Control aria-label="Description" readOnly={user.profile != 'Admin'} value={templateValue.description} onChange={(evt) => update('description', evt.target.value)} />
              </InputGroup>
              {user.profile == 'Admin' ?
                <InputGroup className="mb-3">
                  <InputGroup.Text>Icon</InputGroup.Text>

                  <Form.Control aria-label="file" type="file" id="uploadIcon" onChange={loadIcon} />

                </InputGroup>
                :
                <></>
              }
          <InputGroup className="mb-3">
            <InputGroup.Text>Version</InputGroup.Text>
                <Form.Control aria-label="version" readOnly={user.profile != 'Admin'} type="number" id="version" value={templateValue.version} onChange={(evt) => updateNumber('version', evt.target.value)} />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Element type</InputGroup.Text>

            <Form.Select id="elementType" disabled={user.profile != 'Admin'} value={templateValue.elementType.value} onChange={(evt) => updateElementType(evt.target.value)}>
              <option>bpmn:ServiceTask</option>
              <option>bpmn:SendTask</option>
              <option>bpmn:ScriptTask</option>
              <option>bpmn:BusinessRuleTask</option>
              <option>bpmn:ReceiveTask</option>
              <option>bpmn:UserTask</option>
              <option>bpmn:ManualTask</option>
            </Form.Select>
          </InputGroup>
        </Tab>

        <Tab eventKey="groups" title="Groups">

          <Table variant="primary" striped bordered hover>
            <thead>
              <tr>
                <th>Group Id</th>
                <th>Group Label</th>
                {user.profile == 'Admin' ?
                  <th><Button variant="success" onClick={addGroup}><i className="bi bi-plus-circle"></i></Button></th>
                  : <></>
                }
              </tr>
            </thead>
            <tbody>
              {templateValue.groups ? templateValue.groups.map((group: any, index: number) =>
                <tr key={index}>
                  <td>
                    <Form.Control readOnly={user.profile != 'Admin'} aria-label="GroupId" value={group.id} onChange={(evt) => updateGroup(index, 'id', evt.target.value)} />
                  </td>
                  <td>
                    <Form.Control readOnly={user.profile != 'Admin'} aria-label="GroupLable" value={group.label} onChange={(evt) => updateGroup(index, 'label', evt.target.value)} />
                  </td>
                  {user.profile == 'Admin' ?
                    <td><Button variant="danger" onClick={() => deleteGroup(index)}><i className="bi bi-trash"></i></Button></td>
                    : <></>
                  }
                </tr>
              ) : <></>}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="properties" title="Properties">
          {user.profile == 'Admin' ?
            <Button variant="success" onClick={addProperty}><i className="bi bi-plus-circle"></i> Add a property</Button>
            : <></>}
          <Accordion defaultActiveKey="1">
            {templateValue.properties ? templateValue.properties.map((input: any, index: number) =>
              <Accordion.Item key={index} eventKey={"" + index} className={"templateProperty" + index}>
                <Accordion.Header>{input.label}</Accordion.Header>
                <Accordion.Body>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td>
                          <InputGroup className="mb-1">
                            <InputGroup.Text>Id </InputGroup.Text>
                            <Form.Control aria-label="Id" readOnly={user.profile != 'Admin'} value={input.id} onChange={(evt) => updateInput(index, 'id', evt.target.value)} />
                          </InputGroup>
                        </td>
                        <td>
                          <InputGroup className="mb-1">
                            <InputGroup.Text>Label</InputGroup.Text>
                            <Form.Control aria-label="label" readOnly={user.profile != 'Admin'} value={input.label} onChange={(evt) => updateInput(index, 'label', evt.target.value)} />
                          </InputGroup>
                        </td>
                        <td>
                          <InputGroup className="mb-1">
                            <InputGroup.Text>Group</InputGroup.Text>
                            <Form.Select disabled={user.profile != 'Admin'} value={input.group} onChange={(evt) => updateInput(index, 'group', evt.target.value)}>
                              <option value="setGroupNull">Custom properties</option>
                              {templateValue.groups ? templateValue.groups.map((group: any, indexGroup: number) =>
                                <option key={indexGroup} value={group.id}>{group.label}</option>
                              )
                                : <></>
                              }
                            </Form.Select>
                          </InputGroup>
                        </td>
                        {user.profile == 'Admin' ?
                          <td style={{ width: "50px" }}><Button variant="danger" onClick={() => deleteInput(index)}><i className="bi bi-trash"></i></Button></td>
                          : <></>
                        }
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mb-1">
                            <InputGroup.Text>Binding type</InputGroup.Text>
                            <Form.Select disabled={user.profile != 'Admin'} value={input.binding.type} onChange={(evt) => updateInputBinding(index, 'type', evt.target.value)}>
                              <option>zeebe:input</option>
                              <option>zeebe:output</option>
                              <option>zeebe:taskHeader</option>
                              <option>zeebe:property</option>
                            </Form.Select>
                          </InputGroup>
                        </td>
                        <td>
                          {input.binding.type == 'zeebe:input' || input.binding.type == 'zeebe:property' ?
                            <InputGroup className="mb-1">
                              <InputGroup.Text>Binding name</InputGroup.Text>
                              <Form.Control readOnly={user.profile != 'Admin'} value={input.binding.name} onChange={(evt) => updateInputBinding(index, 'name', evt.target.value)} />
                            </InputGroup>
                            :
                            input.binding.type == 'zeebe:taskHeader' ?
                              <InputGroup className="mb-1">
                                <InputGroup.Text>Binding key</InputGroup.Text>
                                <Form.Control readOnly={user.profile != 'Admin'} value={input.binding.key} onChange={(evt) => updateInputBinding(index, 'key', evt.target.value)} />
                              </InputGroup>
                              :
                              <InputGroup className="mb-1">
                                <InputGroup.Text>Binding source</InputGroup.Text>
                                <Form.Control readOnly={user.profile != 'Admin'} value={input.binding.source} onChange={(evt) => updateInputBinding(index, 'source', evt.target.value)} />
                              </InputGroup>

                          }
                        </td>
                        <td>
                          <InputGroup className="mb-1">
                            <Form.Check
                              type="switch" checked={templateValue.properties[index].optional} onChange={(evt) => swicthOptional(index, evt.target.checked)}
                              label="do not persist empty values" />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputGroup className="mb-1">
                            <InputGroup.Text>Value</InputGroup.Text>
                            <Form.Control aria-label="Value" readOnly={user.profile != 'Admin'} value={input.value} onChange={(evt) => updateInput(index, 'value', evt.target.value)} />
                          </InputGroup>
                        </td>
                        <td colSpan={2}>
                          <InputGroup className="mb-1">
                            <InputGroup.Text>Description</InputGroup.Text>
                            <Form.Control aria-label="label" readOnly={user.profile != 'Admin'} value={input.description} onChange={(evt) => updateInput(index, 'description', evt.target.value)} />
                          </InputGroup>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: "top" }}>
                          <InputGroup className="mb-1">
                            <InputGroup.Text>Type</InputGroup.Text>
                            <Form.Select disabled={user.profile != 'Admin'} value={input.type} onChange={(evt) => updateInput(index, 'type', evt.target.value)}>
                              <option>String</option>
                              <option>Text</option>
                              <option>Dropdown</option>
                              <option>Hidden</option>
                            </Form.Select>
                          </InputGroup>
                        </td>
                        <td colSpan={2}>
                          {input.type == 'String' || input.type == 'Text' ?
                            <InputGroup className="mb-1">
                              <InputGroup.Text>FEEL</InputGroup.Text>
                              <Form.Select disabled={user.profile != 'Admin'} value={input.feel} onChange={(evt) => updateInput(index, 'feel', evt.target.value)}>
                                <option>optional</option>
                                <option>required</option>
                              </Form.Select>
                            </InputGroup>
                            :
                            <table style={{ width: "100%" }} className="mb-1">
                              <thead>
                                <tr>
                                  <th>Choice name</th>
                                  <th>Choice value</th>
                                  {user.profile == 'Admin' ?
                                    <th><Button variant="success" onClick={() => addInputChoice(index)}><i className="bi bi-plus-circle"></i></Button></th>
                                    : <></>
                                  }
                                </tr>
                              </thead>
                              <tbody>
                                {input.choices ? input.choices.map((choice: any, choiceIndex: number) =>
                                  <tr key={choiceIndex}>
                                    <td>
                                      <Form.Control readOnly={user.profile != 'Admin'} value={choice.name} onChange={(evt) => updateInputChoice(index, choiceIndex, 'name', evt.target.value)} />
                                    </td>
                                    <td>
                                      <Form.Control readOnly={user.profile != 'Admin'} value={choice.value} onChange={(evt) => updateInputChoice(index, choiceIndex, 'value', evt.target.value)} />
                                    </td>
                                    {user.profile == 'Admin' ?
                                      <td><Button variant="danger" onClick={() => deleteInputChoice(index, choiceIndex)}><i className="bi bi-trash"></i></Button></td>
                                      : <></>
                                    }
                                  </tr>
                                ) : <></>}
                              </tbody>
                            </table>
                          }
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>
                          <Form.Check disabled={user.profile != 'Admin'}
                            type="switch" checked={templateValue.properties[index].condition} onChange={(evt) => swicthCondition(index, evt.target.checked)}
                            label="Conditional display" />
                          {templateValue.properties[index].condition ?
                            <table style={{ width: "100%" }}>
                              <tr><td style={{ verticalAlign: "top" }}>
                                <InputGroup className="mb-1">
                                  <InputGroup.Text>Property</InputGroup.Text>

                                  <Form.Select disabled={user.profile != 'Admin'} value={templateValue.properties[index].condition.property} onChange={(evt) => updateInputCondition(index, evt.target.value)}>
                                    {templateValue.properties && templateValue.properties.map((property: any, condPropIndex: number) =>
                                      property.id ?
                                        <option key={property.id}>{property.id}</option>
                                        : <></>
                                    )}
                                  </Form.Select>
                                </InputGroup>
                              </td><td style={{ verticalAlign: "top" }}>
                                  <InputGroup className="mb-1">
                                    <Form.Select disabled={user.profile != 'Admin'} value={templateValue.properties[index].condition.oneOf ? "oneOf" : "equals"} onChange={(evt) => updateInputConditionType(index, evt.target.value)}>
                                      <option>equals</option>
                                      <option value="oneOf">is one of</option>
                                    </Form.Select>
                                  </InputGroup>
                                </td>
                                <td>
                                  {templateValue.properties[index].condition.oneOf ?
                                    <table style={{ width: "100%" }} className="mb-1">
                                      <thead>
                                        <tr>
                                          <th>Elements</th>
                                          {user.profile == 'Admin' ?
                                            <th><Button variant="success" onClick={() => addInputConditionChoice(index)}><i className="bi bi-plus-circle"></i></Button></th>
                                            : <></>
                                          }
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {templateValue.properties[index].condition.oneOf ? templateValue.properties[index].condition.oneOf.map((choice: string, oneOfIndex: number) =>
                                          <tr key={oneOfIndex}>
                                            <td>
                                              <Form.Control readOnly={user.profile != 'Admin'} value={choice} onChange={(evt) => updateInputConditionChoice(index, oneOfIndex, evt.target.value)} />
                                            </td>
                                            {user.profile == 'Admin' ?
                                              <td><Button variant="danger" onClick={() => deleteInputConditionChoice(index, oneOfIndex)}><i className="bi bi-trash"></i></Button></td>
                                              : <></>
                                            }
                                          </tr>
                                        ) : <></>}
                                      </tbody>
                                    </table>
                                    :
                                    <InputGroup className="mb-1">
                                      <InputGroup.Text>Value</InputGroup.Text>
                                      <Form.Control readOnly={user.profile != 'Admin'} value={templateValue.properties[index].condition.equals} onChange={(evt) => updateInputConditionValue(index, evt.target.value)} />
                                    </InputGroup>
                                  }
                                </td>
                              </tr>
                            </table>
                            :
                            <></>
                          }
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>
                          <Form.Check disabled={user.profile != 'Admin'}
                            type="switch" checked={templateValue.properties[index].constraints} onChange={(evt) => swicthConstraints(index, evt.target.checked)}
                            label="Has constraints" />
                          {templateValue.properties[index].constraints ?
                            <>
                              <Form.Check disabled={user.profile != 'Admin'}
                                type="switch" checked={templateValue.properties[index].constraints.notEmpty} onChange={(evt) => swicthNotEmpty(index, evt.target.checked)}
                                label="Should not be empty" />

                              <Form.Check disabled={user.profile != 'Admin'}
                                type="switch" checked={templateValue.properties[index].constraints.pattern} onChange={(evt) => swicthPattern(index, evt.target.checked)}
                                label="Should respect a pattern" />

                              {templateValue.properties[index].constraints.pattern ?
                                <table style={{ width: "100%" }}>
                                  <tr>
                                    <td>
                                      <InputGroup className="mb-1">
                                        <InputGroup.Text>Pattern</InputGroup.Text>
                                        <Form.Control readOnly={user.profile != 'Admin'} value={templateValue.properties[index].constraints.pattern.value} onChange={(evt) => updatePattern(index, 'value', evt.target.value)} />
                                      </InputGroup>
                                    </td>
                                    <td>
                                      <InputGroup className="mb-1">
                                        <InputGroup.Text>Explanations</InputGroup.Text>
                                        <Form.Control readOnly={user.profile != 'Admin'} value={templateValue.properties[index].constraints.pattern.message} onChange={(evt) => updatePattern(index, 'message', evt.target.value)} />
                                      </InputGroup>
                                    </td>
                                  </tr>
                                </table>
                                : <></>
                              }
                            </>
                            :
                            <></>
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Accordion.Body>
              </Accordion.Item>
            ) : <></>}
          </Accordion>
        </Tab>
        </Tabs>
        </> : <></>}
    </div >
    <div className="diagram" ref={diagramContainer} />
    <div className="panel" ref={panelContainer} />
      </div >
  );
}

export default ElementTemplate;
