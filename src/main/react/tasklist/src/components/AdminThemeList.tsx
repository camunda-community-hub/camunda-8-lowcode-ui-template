import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminThemeService from '../service/AdminThemeService';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import api from '../service/api';
import { useTranslation } from "react-i18next";

function AdminThemeList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const Themes = useSelector((state: any) => state.adminThemes.Themes)

  const duplicate = (name: string) => {
    api.get('/edition/Themes/' + name).then(response => {
      let Theme = response.data;
      Theme.name = 'Duplicate ' + Theme.name;
      dispatch(adminThemeService.setTheme(Theme));
    }).catch(error => {
      alert(error.message);
    })
  }


  return (
    <div>
      <br />
      <Button variant="primary" onClick={() => dispatch(adminThemeService.newTheme())}><i className="bi bi-plus-square"></i> {t("New theme")}</Button>
   
      <Table striped bordered hover>
		<thead>
		  <tr>
            <th scope="col">{t("Name")}</th>
            <th scope="col">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {Themes ? Themes.map((name: string, index: number) =>
            <tr key={name}>
              <td>{name}</td>
              <td>
                <Button variant="primary" onClick={() => dispatch(adminThemeService.openTheme(name))}><i className="bi bi-pencil"></i> {t("Open")}</Button>
                <Button variant="warning" onClick={() => duplicate(name)}><i className="bi bi-files"></i> {t("Duplicate")}</Button>
                <Button variant="danger" onClick={() => dispatch(adminThemeService.deleteTheme(name))}><i className="bi bi-trash"></i> {t("Delete")}</Button>
              </td>
            </tr>)
          : <></>}
		</tbody>
      </Table>
  </div >
  );
}

export default AdminThemeList
