import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminMailService from '../service/AdminMailService';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import api from '../service/api';
import { useTranslation } from "react-i18next";

function AdminMailList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const mails = useSelector((state: any) => state.adminMails.mails)

  const duplicate = (name: string) => {
    api.get('/edition/mails/' + name).then(response => {
      let mail = response.data;
      mail.name = 'Duplicate ' + mail.name;
      dispatch(adminMailService.setMail(mail));
    }).catch(error => {
      alert(error.message);
    })
  }


  return (
    <div>
      <br />
      <Button variant="primary" onClick={() => dispatch(adminMailService.newMail())}><i className="bi bi-plus-square"></i> {t("New mail")}</Button>
   
      <Table striped bordered hover>
		<thead>
		  <tr>
            <th scope="col">{t("Name")}</th>
            <th scope="col">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {mails ? mails.map((name: string, index: number) =>
            <tr key={name}>
              <td>{name}</td>
              <td>
                <Button variant="primary" onClick={() => dispatch(adminMailService.openMail(name))}><i className="bi bi-pencil"></i> {t("Open")}</Button>
                <Button variant="warning" onClick={() => duplicate(name)}><i className="bi bi-files"></i> {t("Duplicate")}</Button>
                <Button variant="danger" onClick={() => dispatch(adminMailService.deleteMail(name))}><i className="bi bi-trash"></i> {t("Delete")}</Button>
              </td>
            </tr>)
          : <></>}
		</tbody>
      </Table>
  </div >
  );
}

export default AdminMailList
