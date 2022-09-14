import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminFormService from '../service/AdminFormService';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import api from '../service/api';

function AdminFormList() {
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


  return (
    <div>
      <br />
      <Button variant="primary" onClick={() => dispatch(adminFormService.newForm())}><i className="bi bi-plus-square"></i> New Form</Button>
      <Button variant="primary" ><i className="bi bi-box-arrow-in-up"></i> Load from file</Button>
   
      <Table striped bordered hover>
		<thead>
		  <tr>
            <th scope="col">Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms ? forms.map((name: string, index: number) =>
            <tr key={name}>
              <td>{name}</td>
              <td>
                <Button variant="primary" onClick={() => dispatch(adminFormService.openForm(name))}><i className="bi bi-pencil"></i> Open</Button>
                <Button variant="warning" onClick={() => duplicate(name)}><i className="bi bi-files"></i> Duplicate</Button>
                <Button variant="secondary" onClick={() => download(name)}><i className="bi bi-box-arrow-down"></i> Download</Button>
                <Button variant="danger" onClick={() => dispatch(adminFormService.deleteForm(name))}><i className="bi bi-trash"></i> Delete</Button>
              </td>
            </tr>)
          : <></>}
		</tbody>
      </Table>
  </div >
  );
}

export default AdminFormList
