import React from "react";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import authService from '../service/AuthService';
import LanguageSelector from './LanguageSelector';

import { useTranslation } from "react-i18next";

function Navbar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tasklistConf = useSelector((state: any) => state.process.tasklistConf);

  const logout = (event: any) => {
    dispatch(authService.signOut());
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container-fluid">
        <Link to="/home"><div className="logo"></div></Link>
        <div>

          <div className="input-group mb-3">
            
            <LanguageSelector></LanguageSelector>
            <a className="btn btn-outline-secondary" onClick={logout}>{authService.getUser()!.username} <i className="bi bi-box-arrow-left"></i></a>
          </div>
        </div>
      </div>
      <div className="bg-primary menu">
        {tasklistConf.displayIntancesPage ?
          <NavLink to="/tasklist/instances" className={({ isActive }) =>
            isActive ? "text-light menu-item selected" : "text-light menu-item"
          } >{t("Instances page")}</NavLink>
          :<></>}
        <NavLink to="/tasklist/tasks" className={({ isActive }) =>
          isActive ? "text-light menu-item selected" : "text-light menu-item"
        } >{t("Tasks")}</NavLink>
        <NavLink className={({ isActive }) =>
          isActive ? "text-light menu-item selected" : "text-light menu-item"
        } to="/tasklist/processes">{t("Processes")}</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
