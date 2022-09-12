import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import authService from '../service/AuthService';
import logo from '../assets/img/logo.svg'

function Navbar() {
  const dispatch = useDispatch();

  const logout = (event: any) => {
    dispatch(authService.signOut());
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container-fluid">
        <img width="140" src={logo} className="custom-logo" alt="Camunda" />
        <div>

          <div className="input-group mb-3">
            <Link className="btn btn-outline-secondary" to="/tasklist/tasks">Tasks</Link>
            <Link className="btn btn-outline-secondary" to="/tasklist/processes">Processes</Link>
            <a className="btn btn-outline-secondary" onClick={logout}>{authService.getUser()!.username} <i className="bi bi-box-arrow-left"></i></a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
