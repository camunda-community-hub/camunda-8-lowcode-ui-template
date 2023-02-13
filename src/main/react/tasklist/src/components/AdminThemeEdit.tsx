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
  const [currentThemeColors, setCurrentThemeColors] = useState<any | null>(null);
  const [theme, setTheme] = useState<any | null>(null);




  useEffect(() => {
    let theme2 = adminThemeService.getCurrentTheme();
    if (theme2) {
      setTheme(theme2);
      setCurrentThemeColors(Object.assign({}, theme2.variables));
  }
  }, []);

  const setGenVar = (attribute: string, value: string) => {
    let copy = Object.assign({}, currentThemeColors);
    copy[attribute] = value;
    setCurrentThemeColors(copy);
  }
  const handleClose = () => setShowThemeGenerator(false);
  const handleShow = () => setShowThemeGenerator(true);
  const dispatch = useDispatch();

  const onChange = React.useCallback((value: string, viewUpdate: any) => {
    dispatch(adminThemeService.setContent(value));
  }, []);

  const generateCss = () => {
    dispatch(adminThemeService.generateCss(currentThemeColors));
    handleClose();
  }

  const setActive = () => {
    dispatch(adminThemeService.setActive(theme));
  }

  return (
    currentThemeColors ? 
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
              <Form.Control aria-label="Primary" placeholder="primary color" value={currentThemeColors.primary} onChange={(evt) => setGenVar('primary', evt.target.value)} />
              <Form.Control
                type="color"
                value={currentThemeColors.primary}
                title="Choose your color"
                onChange={(evt) => setGenVar('primary', evt.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Secondary</InputGroup.Text>
                <Form.Control aria-label="Secondary" placeholder="secondary color" value={currentThemeColors.secondary} onChange={(evt) => setGenVar('secondary', evt.target.value)} />
                <Form.Control
                  type="color"
                  value={currentThemeColors.secondary}
                  title="Choose your color"
                  onChange={(evt) => setGenVar('secondary', evt.target.value)}
                />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Success</InputGroup.Text>
                <Form.Control aria-label="Success" placeholder="success color" value={currentThemeColors.success} onChange={(evt) => setGenVar('sucess', evt.target.value)} />
                <Form.Control
                  type="color"
                  value={currentThemeColors.success}
                  title="Choose your color"
                  onChange={(evt) => setGenVar('success', evt.target.value)}
                />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Danger</InputGroup.Text>
                <Form.Control aria-label="Danger" placeholder="danger color" value={currentThemeColors.danger} onChange={(evt) => setGenVar('danger', evt.target.value)} />
                <Form.Control
                  type="color"
                  value={currentThemeColors.danger}
                  title="Choose your color"
                  onChange={(evt) => setGenVar('danger', evt.target.value)}
                />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Warning</InputGroup.Text>
                <Form.Control aria-label="Warning" placeholder="warning color" value={currentThemeColors.warning} onChange={(evt) => setGenVar('warning', evt.target.value)} />
                <Form.Control
                  type="color"
                  value={currentThemeColors.warning}
                  title="Choose your color"
                  onChange={(evt) => setGenVar('warning', evt.target.value)}
                />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Info</InputGroup.Text>
                <Form.Control aria-label="Info" placeholder="info color" value={currentThemeColors.info} onChange={(evt) => setGenVar('info', evt.target.value)} />
                <Form.Control
                  type="color"
                  value={currentThemeColors.info}
                  title="Choose your color"
                  onChange={(evt) => setGenVar('info', evt.target.value)}
                />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Light</InputGroup.Text>
                <Form.Control aria-label="Light" placeholder="Light color" value={currentThemeColors.light} onChange={(evt) => setGenVar('light', evt.target.value)} />
                <Form.Control
                  type="color"
                  value={currentThemeColors.light}
                  title="Choose your color"
                  onChange={(evt) => setGenVar('light', evt.target.value)}
                />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Dark</InputGroup.Text>
                <Form.Control aria-label="Dark" placeholder="Dark color" value={currentThemeColors.dark} onChange={(evt) => setGenVar('dark', evt.target.value)} />
                <Form.Control
                  type="color"
                  value={currentThemeColors.dark}
                  title="Choose your color"
                  onChange={(evt) => setGenVar('dark', evt.target.value)}
                />
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
    : <></>
  );
}

export default AdminThemeEdit
