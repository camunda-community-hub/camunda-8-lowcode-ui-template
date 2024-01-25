import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminThemeService from '../service/AdminThemeService';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { Modal, Tabs, Tab, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

function AdminThemeEdit() {
  const { t } = useTranslation();
  const [showThemeGenerator, setShowThemeGenerator] = useState(false);
  const [currentThemeColors, setCurrentThemeColors] = useState<any | null>(null);
  const [theme, setTheme] = useState<any | null>(null);
  const [logos, setLogos] = useState<string[]>([]);
  const [bgs, setBgs] = useState<string[]>([]);

  const handleClose = () => setShowThemeGenerator(false);
  const handleShow = () => setShowThemeGenerator(true);
  const dispatch = useDispatch();

  const load = async () => {
    let theme2 = adminThemeService.getCurrentTheme();
    if (theme2) {
      setTheme(theme2);
      setCurrentThemeColors(Object.assign({}, theme2.variables));
    }
    setLogos(await adminThemeService.getLogos());
    setBgs(await adminThemeService.getBgs());
    console.log(theme2);
  }

  useEffect(() => {
    load();
  }, []);

  const setGenVar = (attribute: string, value: string) => {
    let copy = Object.assign({}, currentThemeColors);
    copy[attribute] = value;
    setCurrentThemeColors(copy);
  }

  const changeColors = (value: string) => {
    if (theme && value) {
      let clone = Object.assign({}, theme);
      clone.colors = value;
      setTheme(clone);
      dispatch(adminThemeService.setTheme(clone));
    }
  }
  const changeContent = (value: string) => {
    if (theme && value) {
    let clone = Object.assign({}, theme);
    clone.content = value;
      setTheme(clone);
      dispatch(adminThemeService.setTheme(clone));
    }
  }

  const generateCss = () => {
    dispatch(adminThemeService.generateCss(currentThemeColors));
    handleClose();
  }

  const setActive = () => {
    dispatch(adminThemeService.setActive(theme));
  }
  const setLogo = (value: string) => {
    let clone = Object.assign({}, theme);
    clone.logo = value;
    console.log(clone);
    setTheme(clone);
    dispatch(adminThemeService.setTheme(clone));
  }
  const setLogoCss = (value: string) => {
    let clone = Object.assign({}, theme);
    clone.logoCss = value;
    setTheme(clone);
    dispatch(adminThemeService.setTheme(clone));
  }

  const uploadLogo = async (event: any) => {
    let file = event.target.files[0];
    let newTheme = await adminThemeService.uploadLogo(file);
    setTheme(newTheme);
    dispatch(adminThemeService.setTheme(newTheme));
    setLogos(await adminThemeService.getLogos());
  }
  const setBg = (value: string) => {
    let clone = Object.assign({}, theme);
    clone.background = value;
    setTheme(clone);
    dispatch(adminThemeService.setTheme(clone));
  }

  const uploadBg = async (event: any) => {
    let file = event.target.files[0];
    let newTheme = await adminThemeService.uploadBg(file);
    setTheme(newTheme);
    dispatch(adminThemeService.setTheme(newTheme));
    setBgs(await adminThemeService.getBgs());
  }

  return (
    theme && currentThemeColors ?
    <Tabs className="mb-3">
        
        <Tab eventKey="imgs" title={t("Images")}>
          {theme.active ? <></> : <Button variant="primary" onClick={setActive}><i className="bi bi-check-lg"></i> {t("Set as active")}</Button>}
          <Row>
            <Col xs={12} md={6} lg={6}>
        <InputGroup className="mb-3">
          <InputGroup.Text> {t("Logo")}</InputGroup.Text>

          <Form.Select value={theme.logo} onChange={(evt) => setLogo(evt.target.value)}>
            {logos ? logos.map((logo: string, index: number) =>
              <option key={index} value={logo}>{logo}</option>
            ) : <></>}
            <option value="==add new logo==">+ Add new logo...</option>
          </Form.Select>
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text> {t("Logo CSS")}</InputGroup.Text>
                <Form.Control as="textarea" rows={4} value={theme.logoCss} onChange={(evt) => setLogoCss(evt.target.value)} />
              </InputGroup>
            </Col>
            {theme.logo == "==add new logo==" ?
              <Col xs={12} md={6} lg={6}>
                <InputGroup className="mb-3">
                  <Form.Control aria-label="Primary" type="file" placeholder="file" onChange={(event: any) => uploadLogo(event)} />
                  <InputGroup.Text><i className="bi bi-paperclip"></i></InputGroup.Text>
                </InputGroup>
              </Col> : <></>}
          </Row>
          <Row>
            <Col xs={12} md={6} lg={6}>
              <InputGroup className="mb-3">
                <InputGroup.Text> {t("Background")}</InputGroup.Text>

                <Form.Select value={theme.background} onChange={(evt) => setBg(evt.target.value)}>
                  {bgs ? bgs.map((bg: string, index: number) =>
                    <option key={index} value={bg}>{bg}</option>
                  ) : <></>}
                  <option value="==add new bg==">+ Add new background...</option>
                </Form.Select>
              </InputGroup>
            </Col>
            {theme.background == "==add new bg==" ?
              <Col xs={12} md={6} lg={6}>
                <InputGroup className="mb-3">
                  <Form.Control aria-label="Primary" type="file" placeholder="file" onChange={(event: any) => uploadBg(event)} />
                  <InputGroup.Text><i className="bi bi-paperclip"></i></InputGroup.Text>
                </InputGroup>
              </Col> : <></>}
          </Row>

      </Tab>
      <Tab eventKey="colors" title={t("Colors")}>
       
          
        
          <Button variant="primary" onClick={handleShow}>{t("Generate from variables")}</Button>
          <Row className="maileditor">
            <Col className="card">
              <h5 className="card-title bg-primary text-light"> {t("Theme editor")}</h5>
              <CodeMirror
                value={theme.colors}
                extensions={[css()]}
                onChange={(value: string) => changeColors(value)} />
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
          </Tab>
        <Tab eventKey="other" title={t("Other custom CSS")}>
          <Row className="maileditor">
          <Col className="card">
            <h5 className="card-title bg-primary text-light"> {t("Other CSS")}</h5>
            <CodeMirror
              value={theme.content}
                extensions={[css()]}
                onChange={(value:string) => changeContent(value)} />
            </Col>
            </Row>
          </Tab>
        </Tabs>
      : <></>



  );
}

export default AdminThemeEdit
