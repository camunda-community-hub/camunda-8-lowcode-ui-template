import React, { Component } from 'react';
import {Stomp} from '@stomp/stompjs';

const rest = require('rest');
const mime = require('rest/interceptor/mime');
const client = rest.wrap(mime);

let stompClient = null;
const baseUrl = 'localhost:8080';
const restUrl = `http://${baseUrl}`;
const sockUrl = `ws://${baseUrl}/ws`;

class AppScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      screen: "waiting"
    };
  }

  init = () => {
    if(this.state.user.username) {
      console.log("init");
      this.getProcesses();
      this.getAssignedTasks();
      this.getUnassignedTasks()
      this.wsConnect();
      this.setState({screen: "home"});
      //this.startProcess(userId);
    }
  }

  onProcessDefClick = (e) => {
    this.props.onProcessDefClick(e);
  };

  getProcesses = () => {
    client(`${restUrl}/process/definition/latest`).then((response) => {
      //console.log("getProcesses");
      //console.log(response);
      this.setState({processDefs: response.entity})
    });
  }

  onProcessDefClick = (e) => {
    //console.log(e.target.id);
    this.startProcessInstance(e.target.id);
  }

  startProcessInstance = (bpmnProcessId) => {
    client({
      path: `${restUrl}/process/${bpmnProcessId}/start`,
      headers: {'Content-Type': 'application/json'},
      entity: {userId: this.state.user.username}
    });
  }

  getAssignedTasks = () => {
    client(`${restUrl}/tasks/myOpenedTasks/${this.state.user.username}`).then((response) => {
      console.log("getAssignedTasks");
      console.log(response);
      this.setState({assignedTasks: response.entity})
    });
  }

  getUnassignedTasks = () => {
    client(`${restUrl}/tasks/unassigned`).then((response) => {
      console.log("getUnassignedTasks");
      console.log(response);
      this.setState({unassignedTasks: response.entity})
    });
  }

  wsConnect = () => {
    stompClient = Stomp.client(sockUrl);
    //let onGetTasks = this.onGetTasks.bind(this);
    //let getTasks = this.getTasks.bind(this);
    //let userId = this.state.user.userId;
    //let onFormReady = this.onFormReady.bind(this);
    stompClient.onConnect = function(frame){
      //stompClient.subscribe('/topic/process/'+userId, onProcessEvent);
      //stompClient.subscribe('/topic/tasks/'+userId, onGetTasks);
      //stompClient.subscribe('/topic/forms/'+userId, onFormReady);
      //getTasks();
    };

    stompClient.onStompError =function(frame) {
      console.log('STOMP error');
    };

    stompClient.activate();
  }

  wsSend = (endpoint, json) => {
    stompClient.send(endpoint, {}, JSON.stringify(json));
  }

  componentDidMount() {
    this.init();
  }

  render() {
    return (
      <div style={{margin: "0 0 0 10px"}} className={"columns"}>
        <div className={"column is-2 is-card"}>
          <aside className="menu">
            <p className="menu-label">
              Tasks
            </p>
            <ul className="menu-list">
              {this.state.tasks ? this.state.tasks.map((task) =>
                <li key={task.id}><a onClick={this.onTaskClick}>{task.processName} - {task.name} [ {task.id} ]</a></li>
              ) : "(No Tasks Found)"}
            </ul>
            <p className="menu-label">
              Processes
            </p>
            <ul className="menu-list">
              {this.state.processDefs ? this.state.processDefs.map((process) =>
                <li key={process.key}><a id={process.bpmnProcessId} onClick={this.onProcessDefClick}>{process.name}</a></li>
              ) : "(No Processes Found)"}
            </ul>
            {/*<ul className="menu-list">
              <li>
                <button className={"button"} onClick={this.startProcessInstance}>Start Process Instance</button>
              </li>
            </ul>*/}
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
    );
  }
}

export default AppScreen;
