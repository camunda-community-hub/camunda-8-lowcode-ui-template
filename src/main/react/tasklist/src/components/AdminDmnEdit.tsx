import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { Allotment } from "allotment";
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "allotment/dist/style.css";
import DmnModeler from 'dmn-js/lib/Modeler';
import {
  DmnPropertiesPanelModule,
  DmnPropertiesProviderModule,
} from 'dmn-js-properties-panel';
import api from '../service/api';
import adminDmnService from '../service/AdminDmnService';
import { useTranslation } from "react-i18next";


function AdminDmnEdit() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dmn = adminDmnService.getCurrentDmn();
  const [name, setName] = useState<string>(dmn.name);
  const [decisionId, setDecisionId] = useState<string>(dmn.decisionId);
  const [contextData, setContextData] = useState<any>(dmn.contextData);

  const [showTest, setShowTest] = useState(false);
  const [result, setResult] = useState('');

  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    document.querySelector('#canvas')!.innerHTML = '';
    document.querySelector('#properties')!.innerHTML = '';
    let editor = new DmnModeler({
      container: '#canvas',
      drd: {
        propertiesPanel: {
          parent: '#properties'
        },
        additionalModules: [
          DmnPropertiesPanelModule,
          DmnPropertiesProviderModule
        ]
      },
      height: 500,
      width: '100%',
      keyboard: {
        bindTo: window
      }
    });
    console.log(dmn);
    editor.importXML(dmn.definition, function (err: any) {
      console.log(err);
    var activeView = editor.getActiveView();
    // apply initial logic in DRD view
    if (activeView.type === 'drd') {
      var activeEditor = editor.getActiveViewer();

      // access active editor components
      var canvas = activeEditor.get('canvas');

      // zoom to fit full viewport
      canvas.zoom('fit-viewport');
      }
    });
    setEditor(editor);
  }, []);


  // load external diagram file via AJAX and open it


  const handleClose = () => setShowTest(false);
  const handleShow = () => setShowTest(true);

  const onChangeDecisionId = (value: string) => {
    setDecisionId(value);
  };

  const onChangeContextData = React.useCallback((value: string, viewUpdate: any) => {
    try {
      setContextData(JSON.parse(value));
      setResult('');
    } catch (err: any) {
    }
  }, []);

  const checkExpression = () => {
    editor.saveXML({ format: true }).then((data: any) => {
      api.post<string[]>('/dmn/test', { decisionId: decisionId, contextData: contextData, definition: data.xml}).then((response:any) => {
        setResult(response.data);
      });
    });
  };

  const saveDmn = () => {
    let clone = Object.assign({}, dmn);
    editor.saveXML({ format: true }).then((data: any) => {
      clone.name = name;
      clone.decisionId = decisionId;
      clone.contextData = contextData;
      clone.definition = data.xml;
      adminDmnService.save(clone);
    });
  }

  const deployDmn = () => {
    let clone = Object.assign({}, dmn);
    editor.saveXML({ format: true }).then((data: any) => {
      clone.name = name;
      clone.decisionId = decisionId;
      clone.contextData = contextData;
      clone.definition = data.xml;
      adminDmnService.deploy(clone);
    });
  }

  return (
    <div style={{ 'marginLeft': '-12px', marginRight: '-12px' }}>
      <div style={{ 'height': 'calc(100vh - 144px)' }}>
        <Allotment defaultSizes={[300, 100]} className="modeler">
            <div id="canvas"></div>
            <div id="properties"></div>
        </Allotment>
      </div>
      <div className="bg-secondary" style={{ 'padding': '5px', display: 'flex', height: '50px', justifyContent: 'space-between' }}>
        <Button variant="primary" onClick={handleShow}><i className="bi bi-bug"></i> test</Button>
        <div>
        <InputGroup className="mb-3">
          <Form.Control aria-label="DMN name" placeholder="DMN name" value={name} onChange={(evt) => setName(evt.target.value)} />
          <Button variant="primary" onClick={() => saveDmn()}>{t("Save")}</Button>
          <Button variant="primary" onClick={() => deployDmn()}>{t("Deploy")}</Button>
        </InputGroup>
          </div>
        <Button variant="secondary" onClick={() => dispatch(adminDmnService.setDmn(null))}><i className="bi bi-arrow-return-left"></i> {t("Back")}</Button>
        </div>
     <Modal show={showTest} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Test DMN")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text">Decision Id</span>
            <input type="text" className="form-control" placeholder="decisionId" value={decisionId} onChange={(evt) => onChangeDecisionId(evt.target.value)}/>
          </div>
          <span className="form-label">Decision evaluation context</span>
          <CodeMirror
            value={JSON.stringify(contextData, null, 2)}
            extensions={[json()]}
            onChange={onChangeContextData}
          />
          <br />
          <Button variant="primary" onClick={checkExpression}><i className="bi bi-bug"></i> test</Button>
          <hr />
          Result
          <CodeMirror
            value={JSON.stringify(result, null, 2)}
            extensions={[json()]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDmnEdit;
