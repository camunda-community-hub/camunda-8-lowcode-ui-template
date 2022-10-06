import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminMailService from '../service/AdminMailService';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';

function AdminMailEdit() {
  const dispatch = useDispatch();

  const mail = adminMailService.getCurrentMail();

  const onChange = React.useCallback((value: string, viewUpdate: any) => {
    dispatch(adminMailService.setMailTemplate(value));
  }, []);

  return (
    <Row className="maileditor">
      <Col className="card">
        <h5 className="card-title bg-primary text-light">Mail editor</h5>
        <CodeMirror
          value={mail.htmlTemplate}
          extensions={[html()]}
          onChange={onChange}/>
      </Col>
      <Col className="card">
        <h5 className="card-title bg-primary text-light">Mail preview</h5>
        <div dangerouslySetInnerHTML={{ __html: mail.htmlTemplate }}></div>
      </Col>
    </Row>
  );
}

export default AdminMailEdit
