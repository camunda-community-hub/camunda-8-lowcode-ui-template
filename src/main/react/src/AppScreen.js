import React, { Component } from 'react';

class AppScreen extends Component {

  doLogout = () => () => {this.props.onlogout()};

  render() {
    return (
      <div>
        <nav className="navbar is-light" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="https://docs.camunda.io">
              <img src="/img/Logo_Black.png" height="28px" alt={"logo"}/>
            </a>
            {// eslint-disable-next-line
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false"
               data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>}
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
            </div>

            <div className="navbar-end">
              {this.props.userId ?
                <React.Fragment>
                <div className="navbar-item">
                  <span>Welcome {this.props.userId}</span>
                </div>
                <div className="navbar-item">
                  <button className={"button"} onClick={this.doLogout()}>Logout</button>
                </div>
                </React.Fragment>
                : null
              }
              <div className="navbar-item">
                <a href="https://github.com/upgradingdave/camunda-deep-dives/camunda-forms-reactjs"
                   target="_source"><i className="fa fa-external-link"></i> Source Code</a>
              </div>
            </div>
          </div>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

export default AppScreen;
