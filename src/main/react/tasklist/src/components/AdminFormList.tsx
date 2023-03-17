import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminFormService from '../service/AdminFormService';
import { Button, ListGroup, Table, Modal, InputGroup, Form } from 'react-bootstrap';
import api from '../service/api';
import { useTranslation } from "react-i18next";

function AdminFormList() {
  const { t } = useTranslation();
  const [showFormUpload, setShowFormUpload] = useState(false);
  const [showFormCreation, setShowFormCreation] = useState(false);
  const [formType, setFormType] = useState<string>('formJs');
  const [uploadedData, setUploadedData] = useState<string|null>(null);
  const handleClose = () => setShowFormUpload(false);
  const handleShow = () => setShowFormUpload(true);
  const dispatch = useDispatch();

  const forms = useSelector((state: any) => state.adminForms.forms)

  const download = (name: string) => {
    api.get('/edition/forms/' + name).then(response => {
      let form = response.data;
      let url = window.URL.createObjectURL(new Blob([JSON.stringify(form.schema, null, 2)], { type: "application/json" }));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = name + ".form";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }).catch(error => {
      alert(error.message);
    })
  }
  const duplicate = (name: string) => {
    api.get('/edition/forms/' + name).then(response => {
      let form = response.data;
      form.schema.id = "Form_" + Math.floor(1000000 + Math.random() * 9000000);
      form.name = 'Duplicate ' + form.name;
      form.previewData = JSON.stringify(form.previewData, null, 2);
      dispatch(adminFormService.setForm(form));
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
        setUploadedData(e.target!.result as string);
      };
    }
  }

  const uploadForm = () => {
    let schema = JSON.parse(uploadedData!);
    let form = { name: schema.id, schema: schema, previewData:'{}' };
    setShowFormUpload(false);
    dispatch(adminFormService.setForm(form));
  }


  return (
    <div>
      <br />
      <Button variant="primary" onClick={() => setShowFormCreation(true)}><i className="bi bi-plus-square"></i> {t("New form")}</Button>
      <Button variant="primary" onClick={handleShow}><i className="bi bi-box-arrow-in-up"></i> {t("Load from a file")}</Button>
   
      <Table striped bordered hover>
		<thead>
		  <tr>
            <th scope="col">{t("Name")}</th>
            <th scope="col">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {forms ? forms.map((name: string, index: number) =>
            <tr key={name}>
              <td>{name}</td>
              <td>
                <Button variant="primary" onClick={() => dispatch(adminFormService.openForm(name))}><i className="bi bi-pencil"></i> {t("Open")}</Button>
                <Button variant="warning" onClick={() => duplicate(name)}><i className="bi bi-files"></i> {t("Duplicate")}</Button>
                <Button variant="secondary" onClick={() => download(name)}><i className="bi bi-box-arrow-down"></i> {t("Download")}</Button>
                <Button variant="danger" onClick={() => dispatch(adminFormService.deleteForm(name))}><i className="bi bi-trash"></i> {t("Delete")}</Button>
              </td>
            </tr>)
          : <></>}
		</tbody>
      </Table>

      <Modal show={showFormUpload} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Upload a form file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>Form file</InputGroup.Text>
            <Form.Control aria-label="file" type="file" id="uploadFormFileControl" onChange={prepareLoad}/>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" disabled={uploadedData==null} onClick={uploadForm}>Load</Button>
          <Button variant="secondary" onClick={handleClose}> Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFormCreation} onHide={() => setShowFormCreation(false)} >
        <Modal.Header closeButton>
          <Modal.Title>Create a form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup defaultActiveKey="#formJs">
            <ListGroup.Item action href="#formJs" onClick={()=>setFormType('formJs')}>
              FormJS
            </ListGroup.Item>
            <ListGroup.Item action href="#formIo" onClick={() => setFormType('formIo')}>
              FormIO
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => dispatch(adminFormService.newForm(formType))}>New</Button>
            <Button variant="secondary" onClick={() => setShowFormCreation(false)}> Close</Button>
        </Modal.Footer>
      </Modal>
  </div >
  );
}

export default AdminFormList
