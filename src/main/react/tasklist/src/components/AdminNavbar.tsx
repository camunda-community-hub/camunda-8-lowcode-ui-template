import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import authService from '../service/AuthService';
import logo from '../assets/img/logo.svg'

function AdminNavbar() {
  const user = useSelector((state: any) => state.auth.data)
  const dispatch = useDispatch();

  const logout = (event: any) => {
    dispatch(authService.signOut());
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <img width="140" src={logo} className="custom-logo" alt="Camunda" />
        <div>

          <div className="input-group mb-3 ">
            <Link className="btn btn-outline-light" to="/admin/forms">Forms</Link>
            <Link className="btn btn-outline-light" to="/admin/mails">Emails</Link>
            {user!.profile == 'Admin' ? <Link className="btn btn-outline-light" to="/admin/users">Users</Link> : <></>}
            <a className="btn btn-outline-light" onClick={logout}>{authService.getUser()!.username} <i className="bi bi-box-arrow-left"></i></a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
