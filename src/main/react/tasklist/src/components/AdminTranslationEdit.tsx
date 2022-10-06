import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminTranslationService from '../service/AdminTranslationService';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from "react-i18next";

function AdminTranslationEdit() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const language = adminTranslationService.getCurrentLanguage();
  const [translations, setTranslations] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    let transArray: { key: string; value: string }[] = [];
    let i = 0;
    for (let prop in language.translations) {
      transArray[i++] = { key: prop, value: language.translations[prop] };
    }
    setTranslations(transArray);
  }, []);

  const setTransKey = (index: number, value: string) => {
    translations[index].key = value;
  }
  const setTransValue = (index: number, value: string) => {
    translations[index].value = value;
  }
  const deleteTrans = (index: number) => {
    translations.splice(index, 1);
    setTranslations(Object.assign([], translations));
  }
  const addTrans = () => {
    translations.push({key: "key", value: "value"});
    setTranslations(Object.assign([], translations));
  }
  const saveLanguage = () => {
    let objTrans: any = {};
    for (let i = 0; i < translations.length; i++) {
      objTrans[translations[i].key] = translations[i].value;
    }
    dispatch(adminTranslationService.setTranslations(objTrans));
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
      {translations ? translations.map((trans:any, index:number) => 
        <tr key={trans.key+index}>
          <td>
            <Form.Control aria-label="Key" placeholder="key" defaultValue={trans.key} onChange={(evt) => setTransKey(index, evt.target.value)} />
          </td>
          <td>
            <Form.Control aria-label="Value" placeholder="value" defaultValue={trans.value} onChange={(evt) => setTransValue(index, evt.target.value)} />
          </td>
          <td>
            <Button variant="danger" onClick={() => deleteTrans(index)}><i className="bi bi-trash"></i></Button>
          </td>
      </tr>
          ) : <></>}
          </tbody>
        <tfoot className="bg-primary">
          <tr>
        <td></td>
          <td></td>
          <td><Button variant="success" onClick={() => addTrans()}><i className="bi bi-plus"></i></Button></td>
            </tr>
        </tfoot>
      </Table>
      </div>
  );
}

export default AdminTranslationEdit
