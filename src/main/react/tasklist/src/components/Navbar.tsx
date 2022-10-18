import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import authService from '../service/AuthService';
import logo from '../assets/img/logo.svg'
import LanguageSelector from './LanguageSelector';

import { useTranslation } from "react-i18next";

function Navbar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const logout = (event: any) => {
    dispatch(authService.signOut());
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container-fluid">
        <Link to="/home"><img width="140" src={logo} className="custom-logo" alt="Camunda" /></Link>
        <div>

          <div className="input-group mb-3">
            
            <LanguageSelector></LanguageSelector>
            <a className="btn btn-outline-secondary" onClick={logout}>{authService.getUser()!.username} <i className="bi bi-box-arrow-left"></i></a>
          </div>
        </div>
      </div>
      <div className="bg-primary menu">
        <Link className="text-light menu-item" to="/tasklist/tasks">{t("Tasks")}</Link>
        <Link className="text-light menu-item" to="/tasklist/processes">{t("Processes")}</Link>
      </div>
    </nav>
  );
}

export default Navbar;
