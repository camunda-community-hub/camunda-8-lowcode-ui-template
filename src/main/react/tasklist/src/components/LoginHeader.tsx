import React from 'react';
import logo from '../assets/img/logo.svg'

function LoginHeader() {
  return (
    <nav className="navbar navbar-light">
      <div className="container-fluid d-flex justify-content-between">
        <span></span><img width="150" src={logo} className="custom-logo" alt="Camunda"/><span></span>
      </div>
    </nav>
  );
}

export default LoginHeader;