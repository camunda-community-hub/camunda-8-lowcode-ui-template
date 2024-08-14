import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { } from 'redux-thunk/extend-redux';
import api from '../service/api';
import authService from '../service/AuthService';
import taskService from '../service/TaskService';
import { Row, Col, InputGroup, Form } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import UploadedDoc from './UploadedDoc';

function Documents(props: any) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentTask = useSelector((state: any) => state.process.currentTask)
  const disabled = !currentTask || !currentTask.assignee || currentTask.assignee != authService.getUser()!.username;
  const docs = useSelector((state: any) => state.documents.docs)
  const missingDocs = useSelector((state: any) => state.documents.missingDocs)

  const onFileChange = (event: any, index: number) => {
    let file = event.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    let doc = Object.assign({}, docs[index]);
    doc.processInstanceKey = currentTask.processInstanceKey;
    formData.append('body', new Blob([JSON.stringify(doc)], {
      type: "application/json"
    }));
    api.post('file/doc', formData,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }).then(response => {
        doc = response.data;
        let clone = JSON.parse(JSON.stringify(docs));
        clone[index] = doc;
        dispatch(taskService.loadDocs(clone));
      }).catch(error => {
        alert(error.message);
      })
  };

  return (
    docs && missingDocs && docs.length > 0 ?
      <div className="card taskform">
        <h5 className="card-title bg-primary text-light" >Documents</h5>
        <Row className="m-2">
          {docs.map((file: any, index: number) =>
            !file.uploaded ?
              <Col key={index} xs={12} md={6} lg={6}>
                <Form.Label>{file.type} : </Form.Label> <i>{file.comment}</i>
                <InputGroup className="mb-3">
                  <Form.Control aria-label="Primary" type="file" placeholder="file" onChange={(event: any) => onFileChange(event, index)} disabled={disabled} />
                  <InputGroup.Text><i className="bi bi-paperclip"></i></InputGroup.Text>
                </InputGroup>
              </Col> : <></>)}
        </Row>
        <Row className="m-2">
          {docs.map((file: any, index: number) =>
            file.uploaded ?
              <Col key={index} xs={12} md={6} lg={6}>
                <UploadedDoc file={file}/>
              </Col> : <></>
          )}
        </Row>
      </div>
      :
      <></>
  )

}

export default Documents;


