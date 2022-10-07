import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminTranslationService from '../service/AdminTranslationService';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useTranslation } from "react-i18next";

function AdminTranslationEdit() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const language = adminTranslationService.getCurrentLanguage();
  const [siteTranslations, setSiteTranslations] = useState<{ key: string; value: string }[]>([]);
  const [formsTranslations, setFormsTranslations] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    let transArray: { key: string; value: string }[] = [];
    let i = 0;
    for (let prop in language.siteTranslations) {
      transArray[i++] = { key: prop, value: language.siteTranslations[prop] };
    }
    setSiteTranslations(transArray);

    transArray = [];
    i = 0;
    for (let prop in language.formsTranslations) {
      transArray[i++] = { key: prop, value: language.formsTranslations[prop] };
    }
    setFormsTranslations(transArray);
  }, []);

  const setSiteTransKey = (index: number, value: string) => {
    siteTranslations[index].key = value;
  }
  const setSiteTransValue = (index: number, value: string) => {
    siteTranslations[index].value = value;
  }
  const setFormsTransKey = (index: number, value: string) => {
    formsTranslations[index].key = value;
  }
  const setFormsTransValue = (index: number, value: string) => {
    formsTranslations[index].value = value;
  }
  const deleteFormsTrans = (index: number) => {
    formsTranslations.splice(index, 1);
    setFormsTranslations(Object.assign([], formsTranslations));
  }
  const addFormsTrans = () => {
    formsTranslations.push({key: "key", value: "value"});
    setFormsTranslations(Object.assign([], formsTranslations));
  }
  const saveLanguage = () => {
    let objSiteTrans: any = {};
    for (let i = 0; i < siteTranslations.length; i++) {
      objSiteTrans[siteTranslations[i].key] = siteTranslations[i].value;
    }
    let objFormsTrans: any = {};
    for (let i = 0; i < formsTranslations.length; i++) {
      objFormsTrans[formsTranslations[i].key] = formsTranslations[i].value;
    }
    dispatch(adminTranslationService.setSiteTranslations(objSiteTrans));
    dispatch(adminTranslationService.setFormsTranslations(objFormsTrans));
    dispatch(adminTranslationService.saveCurrentLanguage());
  }

  return (
    <div className="container-fluid">
      <br />
      <Row>
        <Col>
          <InputGroup className="mb-3">
            <InputGroup.Text> {t("Language name")}</InputGroup.Text>
            <Form.Control aria-label="name" placeholder="language name" defaultValue={language.name} onChange={(evt) => dispatch(adminTranslationService.setLanguageName(evt.target.value))} />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text> {t("Language code")}</InputGroup.Text>
            <Form.Control aria-label="code" placeholder="language code" defaultValue={language.code} onChange={(evt) => dispatch(adminTranslationService.setLanguageCode(evt.target.value))} />
          </InputGroup>
        </Col>
        <Col>
          <Button variant="primary" onClick={saveLanguage}>{t("Save")}</Button>
        </Col>
      </Row>
      <h2 className="text-primary">{t("Dictionnary")}</h2>
      <Tabs
        defaultActiveKey="site"
        className="mb-3"
      >
        <Tab eventKey="site" title="Site">
          <Table striped bordered hover>
            <thead className="bg-primary">
              <tr>
                <th className="text-light">
                  Key
                </th>
                <th className="text-light">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {siteTranslations ? siteTranslations.map((trans: any, index: number) =>
                <tr key={trans.key + index}>
                  <td>
                    {trans.key}
                  </td>
                  <td>
                    <Form.Control aria-label="Value" placeholder="value" defaultValue={trans.value} onChange={(evt) => setSiteTransValue(index, evt.target.value)} />
                  </td>
                </tr>
              ) : <></>}
            </tbody>
            <tfoot className="bg-primary">
              <tr>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </Tab>
        <Tab eventKey="forms" title="Forms">
          <Table striped bordered hover>
            <thead className="bg-primary">
              <tr>
                <th className="text-light">
                  Key
                </th>
                <th className="text-light">
                  Value
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formsTranslations ? formsTranslations.map((trans: any, index: number) =>
                <tr key={trans.key + index}>
                  <td>
                    <Form.Control aria-label="Key" placeholder="key" defaultValue={trans.key} onChange={(evt) => setFormsTransKey(index, evt.target.value)} />
                  </td>
                  <td>
                    <Form.Control aria-label="Value" placeholder="value" defaultValue={trans.value} onChange={(evt) => setFormsTransValue(index, evt.target.value)} />
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => deleteFormsTrans(index)}><i className="bi bi-trash"></i></Button>
                  </td>
                </tr>
              ) : <></>}
            </tbody>
            <tfoot className="bg-primary">
              <tr>
                <td></td>
                <td></td>
                <td><Button variant="success" onClick={() => addFormsTrans()}><i className="bi bi-plus"></i></Button></td>
              </tr>
            </tfoot>
          </Table>
        </Tab>
      </Tabs>
      </div>
  );
}

export default AdminTranslationEdit
