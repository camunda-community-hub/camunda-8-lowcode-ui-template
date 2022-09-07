import React, { Component } from 'react';
import {Stomp} from '@stomp/stompjs';
import { Form } from '@bpmn-io/form-js-viewer';

const rest = require('rest');
const mime = require('rest/interceptor/mime');
const client = rest.wrap(mime);

let stompClient = null;
const baseUrl = 'localhost:8080';
const restUrl = `http://${baseUrl}`;
const sockUrl = `ws://${baseUrl}/ws`;

let merge = (a, b) => ({...a,...b});

let mergeTask = (task, tasks) => {
  if (tasks) {
    let found = false;
    for (let i = 0; i < tasks.length; i++) {
      if ((task.id === tasks[i].id) || (task.jobKey && task.jobKey === tasks[i].jobKey)) {
        found = true;
      }
    }
    if (found) {
      return tasks;
    } else {
      tasks.push(task);
      return tasks;
    }
  } else return [task];
}

class AppScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      selectedTask: null,
      initialized: false,
      screen: "waiting"
    };
  }

  init = () => {
    if(this.state.user.username && !this.state.user.initialized) {
      console.log("init");
      this.getProcesses();
      this.getAssignedTasks();
      this.getUnassignedTasks()
      this.wsConnect();
      this.setState({screen: "home"});
      this.setState({initialized: true});
      //this.startProcess(userId);
    }
  }

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

  onTaskClick = (task) => (e) => {
    this.clearSelectedTask();
    this.onUserTaskReady(task);
  }

  wsConnect = () => {
    stompClient = Stomp.client(sockUrl);
    let userId = this.state.user.username;
    let onUserTaskReadyWS = this.onUserTaskReadyWS.bind(this);
    stompClient.onConnect = function(frame){
      stompClient.subscribe("/topic/" + userId + "/userTask", onUserTaskReadyWS);
    };

    stompClient.onStompError =function(frame) {
      console.log('STOMP error');
    };

    stompClient.activate();
  }

  wsSend = (endpoint, json) => {
    stompClient.send(endpoint, {}, JSON.stringify(json));
  }

  onUserTaskReadyWS = (message) => {
    console.log("TASK ARRIVED!!");
    let task = JSON.parse(message.body);
    // Update the list of tasks
    let tasks = mergeTask(task, this.state.assignedTasks);
    console.log("UPDATED TASKS");
    console.log(tasks);
    this.setState({assignedTasks: tasks});
    this.onUserTaskReady(task);
  }

  onUserTaskReady = (task) => {
    //console.log(task);
    this.setState({selectedTask: task});
    this.setState({screen: "loadForm"});
  }

  clearSelectedTask = () => {

    // remove selected Task
    this.setState({selectedTask: null});

    // remove form from dom
    const container = document.querySelector('#form');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  onFormSubmit = (e, results) => {
    let { data, errors } = results;
    if (Object.keys(errors).length) {
      console.error('Form has errors', errors);
    } else {
      console.log(data);
      this.setState({screen: "waiting"});
      // merge variables
      let variables = merge(this.state.selectedTask.variables, results.data);
      this.completeTask(variables);

      // remove task from list
      let tasks = this.state.assignedTasks;
      let task = this.state.selectedTask;
      let newTasks = []
      for (let i = 0; i < tasks.length; i++) {
        if ((task.id === tasks[i].id) || (task.jobKey && task.jobKey === tasks[i].jobKey)) {
          // skip
        } else {
          newTasks.push(tasks[i]);
        }
      }
      this.setState({assignedTasks: newTasks});

      this.clearSelectedTask();
    }
  }

  completeTask = (variables) => {
    let task = this.state.selectedTask;
    if(task.jobKey) {
      // complete using ZeebeClient
      client({
        path: `${restUrl}/tasks/withJobKey/${task.jobKey}`,
        headers: {'Content-Type': 'application/json'},
        entity: variables
      }).then((response) => {
        //this.getAssignedTasks();
        //this.getUnassignedTasks();
      });
    } else {
      // complete using TaskList Graphql
      client({
        path: `${restUrl}/tasks/${task.id}`,
        headers: {'Content-Type': 'application/json'},
        entity: variables
      }).then((response) => {
        //this.getAssignedTasks();
        //this.getUnassignedTasks();
      });
    }

  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.screen === "loadForm") {
      console.log("Attempt to load form");

      this.setState({screen: "form"});

      // Load the form
      const container = document.querySelector('#form');
      if(!container.firstChild) {
        const bpmnForm = new Form({container: container});
        bpmnForm.on('submit', this.onFormSubmit);
        let schema = JSON.parse(this.state.selectedTask.formSchema);
        let variables = this.state.selectedTask.variables;
        bpmnForm.importSchema(schema, variables).then(
          function (result) {
            //console.log(result);
          });

        this.setState({bpmnForm: bpmnForm});
      }
    }
  }

  render() {
    return (
      <div style={{margin: "0 0 0 10px"}} className={"columns"}>
        <div className={"column is-2 is-card"}>
          <aside className="menu">
            <p className="menu-label">
              My Tasks
            </p>
            <ul className="menu-list">
              {this.state.assignedTasks ? this.state.assignedTasks.map((task) =>
                <li key={task.id}>
                  <a id={task.id} onClick={this.onTaskClick(task)}
                     className={this.state.selectedTask && ((task.id === this.state.selectedTask.id) || (task.jobKey && (task.jobKey === this.state.selectedTask.jobKey))) ? "is-active" : ""}>
                    <span className={"is-size-5 has-text-weight-medium"}>{task.name}</span><br/>
                    <span className={"is-size-6 has-text-weight-light"}>{task.processName}</span><br/>
                    <span className={"is-size-7 has-text-weight-light"}>{task.creationTime}</span>
                </a>
                </li>
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
              <div id={"form"}></div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default AppScreen;
