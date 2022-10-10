import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminThemeService from '../service/AdminThemeService';
import CodeMirror from '@uiw/react-codemirror';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { css } from '@codemirror/lang-css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from "react-i18next";

function AdminThemeEdit() {
  const { t } = useTranslation();
  const [showThemeGenerator, setShowThemeGenerator] = useState(false);


  const theme = adminThemeService.getCurrentTheme();
  let generatorVariables = Object.assign({}, theme.variables);

  const setGenVar = (attribute: string, value: string) => {
    let merged:any = {};
    merged[attribute] = value;
    Object.assign(generatorVariables, merged);
  }
  const handleClose = () => setShowThemeGenerator(false);
  const handleShow = () => setShowThemeGenerator(true);
  const dispatch = useDispatch();

  const onChange = React.useCallback((value: string, viewUpdate: any) => {
    dispatch(adminThemeService.setContent(value));
  }, []);

  const generateCss = () => {
    dispatch(adminThemeService.generateCss(generatorVariables));
    handleClose();
  }

  const setActive = () => {
    dispatch(adminThemeService.setActive(theme));
  }

  return (
    <>
      {theme.active ? <></> : <Button variant="primary" onClick={setActive}><i className="bi bi-check-lg"></i> {t("Set as active")}</Button>}
      &nbsp;
      <Button variant="primary" onClick={handleShow}>{t("Generate from variables")}</Button>
      <Row className="maileditor">
        <Col className="card">
          <h5 className="card-title bg-primary text-light"> {t("Theme editor")}</h5>
          <CodeMirror
            value={theme.content}
            extensions={[css()]}
            onChange={onChange}/>
        </Col>
        <Modal show={showThemeGenerator} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>ThemeGenerator</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text>Primary</InputGroup.Text>
              <Form.Control aria-label="Primary" placeholder="primary color" defaultValue={generatorVariables.primary} onChange={(evt) => setGenVar('primary', evt.target.value)}/>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Secondary</InputGroup.Text>
              <Form.Control aria-label="Secondary" placeholder="secondary color" defaultValue={generatorVariables.secondary} onChange={(evt) => setGenVar('secondary', evt.target.value)} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Success</InputGroup.Text>
              <Form.Control aria-label="Success" placeholder="success color" defaultValue={generatorVariables.success} onChange={(evt) => setGenVar('sucess', evt.target.value)} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Danger</InputGroup.Text>
              <Form.Control aria-label="Danger" placeholder="danger color" defaultValue={generatorVariables.danger} onChange={(evt) => setGenVar('danger', evt.target.value)} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Warning</InputGroup.Text>
              <Form.Control aria-label="Warning" placeholder="warning color" defaultValue={generatorVariables.warning} onChange={(evt) => setGenVar('warning', evt.target.value)} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Info</InputGroup.Text>
              <Form.Control aria-label="Info" placeholder="info color" defaultValue={generatorVariables.info} onChange={(evt) => setGenVar('info', evt.target.value)} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Light</InputGroup.Text>
              <Form.Control aria-label="Light" placeholder="Light color" defaultValue={generatorVariables.light} onChange={(evt) => setGenVar('light', evt.target.value)} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Dark</InputGroup.Text>
              <Form.Control aria-label="Dark" placeholder="Dark color" defaultValue={generatorVariables.dark} onChange={(evt) => setGenVar('dark', evt.target.value)} />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="primary" onClick={generateCss}>
              {t("Generate")}
              </Button>
              <Button variant="secondary" onClick={handleClose}>
              {t("Close")}
              </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </>
  );
}

export default AdminThemeEdit
