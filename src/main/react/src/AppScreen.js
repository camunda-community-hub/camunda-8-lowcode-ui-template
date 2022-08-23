import React, { Component } from 'react';

class AppScreen extends Component {

  doLogout = () =>  () => {this.props.onlogout()};

  startProcessInstance = () => {this.props.startProcessInstance()};

  onTaskClick = () => this.props.onTaskClick;

  render() {
    return (
      <div>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="https://docs.camunda.io">
              <img src="/reactjs/public/Logo_Black.png" height="28px" alt={"logo"}/>
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
        <div style={{margin: "0 0 0 10px" }} className={"columns"}>
          <div className={"column is-2"}>
            <aside className="menu">
              <ul className="menu-list">
                <li><button className={"button"} onClick={this.startProcessInstance}>Start Process Instance</button></li>
              </ul>
              <p className="menu-label">
                Tasks
              </p>
              <ul className="menu-list">
                {this.props.tasks ? this.props.tasks.map((task) =>
                  <li key={task.id}><a onClick={this.onTaskClick}>{task.processName} - {task.name} [ {task.id} ]</a></li>
                ) : "(No Tasks Found)"}
              </ul>
            </aside>
          </div>
          <div className={"column"}>
            <section className="section">
              <div className="container">
                {this.props.children}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default AppScreen;
