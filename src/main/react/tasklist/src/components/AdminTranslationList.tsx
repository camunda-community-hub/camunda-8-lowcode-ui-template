import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminTranslationService from '../service/AdminTranslationService';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import api from '../service/api';
import { useTranslation } from "react-i18next";

function AdminTranslationList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const languages = useSelector((state: any) => state.translations.languages)

  const duplicate = (name: string) => {
    api.get('/api/i18n/' + name).then(response => {
      let intl = response.data;
      intl.name = 'Duplicate ' + intl.name;
      dispatch(adminTranslationService.setLanguage(intl));
    }).catch(error => {
      alert(error.message);
    })
  }


  return (
    <div>
      <br />
      <Button variant="primary" onClick={() => dispatch(adminTranslationService.new())}><i className="bi bi-plus-square"></i> {t("New translation")}</Button>
   
      <Table striped bordered hover>
		<thead>
		  <tr>
            <th scope="col">{t("Name")}</th>
            <th scope="col">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {languages ? languages.map((language: any, index: number) =>
            <tr key={language.name}>
              <td>{language.name}</td>
              <td>
                <Button variant="primary" onClick={() => dispatch(adminTranslationService.open(language.name))}><i className="bi bi-pencil"></i> {t("Open")}</Button>
                <Button variant="warning" onClick={() => duplicate(language.name)}><i className="bi bi-files"></i> {t("Duplicate")}</Button>
                <Button variant="danger" onClick={() => dispatch(adminTranslationService.delete(language.name))}><i className="bi bi-trash"></i> {t("Delete")}</Button>
              </td>
            </tr>)
          : <></>}
		</tbody>
      </Table>
  </div >
  );
}

export default AdminTranslationList
