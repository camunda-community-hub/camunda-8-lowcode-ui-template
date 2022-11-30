import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminDmnService from '../service/AdminDmnService';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import api from '../service/api';
import { useTranslation } from "react-i18next";

function AdminDmnList() {
  const { t } = useTranslation();
  const [showDmnUpload, setShowDmnUpload] = useState(false);
  const [uploadedData, setUploadedData] = useState<string|null>(null);
  const handleClose = () => setShowDmnUpload(false);
  const handleShow = () => setShowDmnUpload(true);
  const dispatch = useDispatch();

  const dmns = useSelector((state: any) => state.adminDmns.dmns)

  const download = (name: string) => {
    api.get('/dmn/' + name).then(response => {
      let dmn = response.data;
      let url = window.URL.createObjectURL(new Blob([dmn.definition], { type: "application/xml" }));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = name + ".dmn";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }).catch(error => {
      alert(error.message);
    })
  }
  const duplicate = (name: string) => {
    api.get('/dmn/' + name).then(response => {
      let dmn = response.data;
      dmn.name = 'Duplicate ' + dmn.name;
      dmn.contextData = JSON.stringify(dmn.contextData, null, 2);
      dispatch(adminDmnService.setDmn(dmn));
    }).catch(error => {
      alert(error.message);
    })
  }

  const prepareLoad = (evt:any) => {
    var file = evt.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file);
 
      reader.onload = function (e) {
        console.log(e.target!.result);
        setUploadedData(e.target!.result as string);
      };
    }
  }

  const uploadDmn = () => {
    let dmn = { name: 'uploaded', definition: uploadedData!, decisionId:'', contextData:'{}' };
    setShowDmnUpload(false);
    dispatch(adminDmnService.setDmn(dmn));
  }


  return (
    <div>
      <br />
      <Button variant="primary" onClick={() => dispatch(adminDmnService.newDmn())}><i className="bi bi-plus-square"></i> {t("New dmn")}</Button>
      <Button variant="primary" onClick={handleShow}><i className="bi bi-box-arrow-in-up"></i> {t("Load from a file")}</Button>
   
      <Table striped bordered hover>
		<thead>
		  <tr>
            <th scope="col">{t("Name")}</th>
            <th scope="col">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {dmns ? dmns.map((name: string, index: number) =>
            <tr key={name}>
              <td>{name}</td>
              <td>
                <Button variant="primary" onClick={() => dispatch(adminDmnService.openDmn(name))}><i className="bi bi-pencil"></i> {t("Open")}</Button>
                <Button variant="warning" onClick={() => duplicate(name)}><i className="bi bi-files"></i> {t("Duplicate")}</Button>
                <Button variant="secondary" onClick={() => download(name)}><i className="bi bi-box-arrow-down"></i> {t("Download")}</Button>
                <Button variant="danger" onClick={() => dispatch(adminDmnService.delete(name))}><i className="bi bi-trash"></i> {t("Delete")}</Button>
              </td>
            </tr>)
          : <></>}
		</tbody>
      </Table>

      <Modal show={showDmnUpload} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Upload a DMN file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>Form file</InputGroup.Text>
            <Form.Control aria-label="file" type="file" id="uploadDmnFileControl" onChange={prepareLoad}/>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" disabled={uploadedData==null} onClick={uploadDmn}>Load</Button>
          <Button variant="secondary" onClick={handleClose}> Close</Button>
        </Modal.Footer>
      </Modal>
  </div >
  );
}

export default AdminDmnList
