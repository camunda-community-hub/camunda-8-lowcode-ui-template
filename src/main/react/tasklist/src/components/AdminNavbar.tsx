import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import authService from '../service/AuthService';
import adminFormService from '../service/AdminFormService';
import logo from '../assets/img/logo.svg'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function AdminNavbar() {
  const user = useSelector((state: any) => state.auth.data)
  const form = useSelector((state: any) => state.adminForms.currentForm)
  const dispatch = useDispatch();

  const logout = (event: any) => {
    dispatch(authService.signOut());
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <img width="140" src={logo} className="custom-logo" alt="Camunda" />
        <div>
          {form ?
            <InputGroup className="mb-3">
              <Button variant="primary"><i className="bi bi-eye"></i></Button>
              <Form.Control aria-label="Form name" value={form.name} onChange={(evt) => form.name = evt.target.name}/>
              <Button variant="primary" onClick={() => adminFormService.saveCurrentForm()}>Save</Button>
              <Button variant="secondary" onClick={() => dispatch(adminFormService.setForm(null))}><i className="bi bi-arrow-return-left"></i> Back</Button>
            </InputGroup>
            :
            <div className="input-group mb-3 ">
              <Link className="btn btn-outline-light" to="/admin/forms">Forms</Link>
              <Link className="btn btn-outline-light" to="/admin/mails">Emails</Link>
              {user!.profile == 'Admin' ? <Link className="btn btn-outline-light" to="/admin/users">Users</Link> : <></>}
              <a className="btn btn-outline-light" onClick={logout}>{authService.getUser()!.username} <i className="bi bi-box-arrow-left"></i></a>
            </div>
          }
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
