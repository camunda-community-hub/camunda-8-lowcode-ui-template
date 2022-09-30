import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import authService from '../service/AuthService';
import adminFormService from '../service/AdminFormService';
import adminMailService from '../service/AdminMailService';
import logo from '../assets/img/logo.svg'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import DataPreviewEditor from './DataPreviewEditor';
import FormPreview from './FormPreview';


function AdminNavbar() {
  const user = useSelector((state: any) => state.auth.data)
  const form = useSelector((state: any) => state.adminForms.currentForm)
  const formEditor = useSelector((state: any) => state.adminForms.formEditor)
  const mail = useSelector((state: any) => state.adminMails.currentMail)

  const dispatch = useDispatch();
  const [showPreview, setShowPreview] = useState(false);

  const handleClose = () => setShowPreview(false);
  const handleShow = () =>  setShowPreview(true);

  const logout = (event: any) => {
    dispatch(authService.signOut());
  };
  return (
    <>
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <img width="140" src={logo} className="custom-logo" alt="Camunda" />
        <div>
          {form ?
            <InputGroup className="mb-3">
              <Button variant="primary" onClick={handleShow}><i className="bi bi-eye"></i></Button>
                <Form.Control aria-label="Form name" placeholder="Form name" value={form.name} onChange={(evt) => dispatch(adminFormService.setFormName(evt.target.value))} />
                <Button variant="primary" onClick={() => adminFormService.saveCurrentForm()}>Save</Button>
              <Button variant="secondary" onClick={() => dispatch(adminFormService.setForm(null))}><i className="bi bi-arrow-return-left"></i> Back</Button>
            </InputGroup>
              :
              mail ?
                <InputGroup className="mb-3">
                  <Form.Control aria-label="Mail template name" placeholder="Mail template name" value={mail.name} onChange={(evt) => dispatch(adminMailService.setMailName(evt.target.value))} />
                  <Button variant="primary" onClick={() => dispatch(adminMailService.saveCurrentMail())}>Save</Button>
                  <Button variant="secondary" onClick={() => dispatch(adminMailService.setMail(null))}><i className="bi bi-arrow-return-left"></i> Back</Button>
                </InputGroup>
                :
                <div className="input-group mb-3 ">
                  <Link className="btn btn-outline-light" to="/admin/forms">Forms</Link>
                  <Link className="btn btn-outline-light" to="/admin/mails">Emails</Link>
                  {user!.profile === 'Admin' ? <Link className="btn btn-outline-light" to="/admin/users">Users</Link> : <></>}
                  <a className="btn btn-outline-light" onClick={logout}>{authService.getUser()!.username} <i className="bi bi-box-arrow-left"></i></a>
                </div>
          }
        </div>
      </div>
      </nav>
      {form && formEditor ?
        <Modal show={showPreview} onHide={handleClose} animation={false} fullscreen>
          <Modal.Header closeButton>
            <Modal.Title>Preview form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="card col"><DataPreviewEditor /></div>
              <div className="card col"><FormPreview schema={formEditor.getSchema()} variables={[]} disabled={false} /></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        :
        <></>
      }
      </>
  );
}

export default AdminNavbar;
