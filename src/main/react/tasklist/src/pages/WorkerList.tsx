import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import eltTemplateService from '../service/EltTemplateService';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import api from '../service/api';
import { useTranslation } from "react-i18next";
import { Alert } from 'react-bootstrap';

function WorkerList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const workers = useSelector((state: any) => state.workers.workers)

  useEffect(() => {
    dispatch(eltTemplateService.getWorkers());
  }, []);


  const downloadEltTmplate = (name: string) => {
    api.get('/elttemplates/' + name).then(response => {
      let url = window.URL.createObjectURL(new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" }));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = response.data.name + ".json";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }).catch(error => {
      alert(error.message);
    })
  }

  return (
    <div>
      <br/>
      <Alert variant="info">The following list contains workers that were automatically detected at runtime. You can define element templates on top of these workers to provide guided properties at conception time for your business stakeholders.</Alert>
      <Table striped bordered hover>
        <tbody>
          {workers ? workers.map((worker: any, index: number) =>
            <tr key={index}>
              <td>Name : {worker.name}<br/> Type : {worker.type }</td>
              <td>

                <Button variant="primary" className="me-1" onClick={() => downloadEltTmplate(worker.type)}><i className="bi bi-download"> </i> {t("Element template")}</Button>
                <Link className="btn btn-primary" to={"/admin/elementTemplate/" + worker.type}><i className="bi bi-pencil"> </i> {t("Edit template")}</Link>
                     
              </td>
            </tr>)
          : <></>}
		</tbody>
      </Table>
  </div >
  );
}

export default WorkerList;
