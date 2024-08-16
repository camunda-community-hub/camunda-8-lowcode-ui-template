import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import type { } from 'redux-thunk/extend-redux';
import authService from '../service/AuthService';
import formService from '../service/FormService';
import taskService from '../service/TaskService';
import FormResolver from '../components/FormResolver';
import api from '../service/api';
import { OverlayTrigger, Tooltip, Button, Dropdown, Modal, Alert } from 'react-bootstrap';
import { Form } from '@bpmn-io/form-js-viewer';
import { Form as CommForm} from '@camunda-community/form-js-viewer';
import { Formio } from 'formiojs';

import { useTranslation } from "react-i18next";
import { CaseMgmtViewer, ITask } from '../store/model';

function CaseMgmtComponent(props: CaseMgmtViewer) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  //const taskMessagesConf = useSelector((state: any) => state.process.messagesConf)
  const [messagesConf, setMessagesConf] = useState<any>(null);
  const [showMessageConf, setShowMessageConf] = useState<any>(null);
  const [messageConfirmation, setMessageConfirmation] = useState<any>(null);
  const [bpmnForm, setBpmnForm] = useState<any>(null);

  useEffect(() => {
    if (props && props.type) {
      if (props.type == "task") {
        api.get<any>('/casemgmt/messages/' + props.processDefinitionKey + '/' + props.taskEltId).then(response => {
          setMessagesConf(response.data);
        }).catch(error => {
          alert(error.message);
        });
      } else if (props.type == "instance") {
        api.get<any>('/casemgmt/messages/' + props.bpmnProcessId).then(response => {
          setMessagesConf(response.data);
        }).catch(error => {
          alert(error.message);
        });
      } else if (props.type == "multiInstances") {
        api.get<any>('/casemgmt/messages/' + props.bpmnProcessId).then(response => {
          let actions = [{
            "id": "cancelInstance",
            "bpmnProcessId": props.bpmnProcessId,
            "message": "cancelInstance",
            "name": "cancel instances",
            "correlationKey": "",
          }].concat(response.data);
          setMessagesConf(actions);
        }).catch(error => {
          alert(error.message);
        });
      }
    }
  }, [props]);

  const sendMessage = (showMessageConf: any) => {
    let variables = {};
    if (showMessageConf.formKey && bpmnForm) {
      if (showMessageConf.schema.generator == 'formIo') {
        variables = bpmnForm._data;
      } else {
        variables = bpmnForm._getState().data;
      }
    }
    if (props.type == "task" || props.type == "instance") {
      api.post<any>('/casemgmt/message/' + showMessageConf.message + '/' + props.processInstanceKey, variables).then(response => {
        setMessageConfirmation(response.data);
      }).catch(error => {
        alert(error.message);
      });
    } else if (props.type == "multiInstances" && props.instances) {
      for (let i = 0; i < props.instances.length; i++) {
        let url = '/instances/cancel/' + props.instances[i].key;
        if (showMessageConf.correlationKey !== "" && showMessageConf.id !== 'cancelInstance') {
          url = '/casemgmt/message/' + showMessageConf.message + '/' + props.instances[i].key;
        }
        api.post<any>(url, variables).then(response => {
          setMessageConfirmation(response.data);
        }).catch(error => {
          alert(error.message);
        });
      }
      closeMessage();
    }
  }

  const closeMessage = () => {
    setShowMessageConf(null);
    setMessageConfirmation(null);
    setBpmnForm(null);
    navigate(props.redirect);
  }

  const openMessage = async (messageConf: any) => {
    if (messageConf.formKey) {
      let clone = Object.assign({}, messageConf)
      clone.schema = await formService.getMessageForm(messageConf.formKey);
      setShowMessageConf(clone);
    } else {
      setShowMessageConf(messageConf);
    }
  }
 
  const buildFormIo = async (container: any) => {
    let formIoForm = await Formio.createForm(container, showMessageConf.schema!);
    formIoForm.submission = {
      data: props.variables,
    };
    setBpmnForm(formIoForm);

  }

  useEffect(() => {
    if (showMessageConf && showMessageConf.schema) {
      console.log('ptouy');
      const container = document.getElementById("message-form");
      console.log(container);
      if (container) {
        container.innerHTML = '';
        if (showMessageConf.schema.generator == 'formIo') {
          buildFormIo(container);
        }
        else if (showMessageConf.schema.generator == 'extendedFormJs') {
          let bpmnForm = new CommForm({ container: container });
          console.log(JSON.parse(JSON.stringify(showMessageConf.schema)));
          bpmnForm.importSchema(showMessageConf.schema, props.variables).then(
            function (result: any) {
              console.log(result);
            });
          setBpmnForm(bpmnForm);
        }
        else {
          let bpmnForm = new Form({ container: container });
          bpmnForm.importSchema(showMessageConf.schema, props.variables).then(
            function (result: any) {
              console.log(result);
            });
          setBpmnForm(bpmnForm);
        }
      }
    }
  }, [showMessageConf]);

  return (
    messagesConf && messagesConf.length>0 ?
      <>
        {messagesConf.length == 1 ?
          <Button variant="dark" onClick={() => openMessage(messagesConf[0])}>{messagesConf[0].name}</Button>
          : messagesConf && messagesConf.length > 1 ?
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                More actions
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {messagesConf.map((conf: any) =>
                  <Dropdown.Item key={conf.id} onClick={() => openMessage(conf)}>{conf.name}</Dropdown.Item>)}
              </Dropdown.Menu>
            </Dropdown>
            : <></>}
          
        <Modal show={showMessageConf} onHide={closeMessage} size="lg">
          {showMessageConf ? <>
            <Modal.Header closeButton>
              <Modal.Title>{showMessageConf.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {messageConfirmation ?
                <Alert variant={messageConfirmation.status }>{messageConfirmation.message}</Alert>
                : showMessageConf.formKey ?
                   <div id="message-form"></div>
                  :
                  <span>Are you sure you want to execute "{showMessageConf.name}" action on that instance ? </span>
              }
            </Modal.Body>
            <Modal.Footer>
              {messageConfirmation == null ?
                <Button variant="primary" onClick={() => sendMessage(showMessageConf)}>
                  <i className="bi bi-send"></i>  {t("Confirm")}
                </Button> : <></>}
              <Button variant="secondary" onClick={closeMessage}>
                {t("Close")}
              </Button>
            </Modal.Footer>
          </> : <></>}
        </Modal>
      </> : <></>
  )

}

export default CaseMgmtComponent;


