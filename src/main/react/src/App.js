import React, { Component } from 'react';
import Login from './Login';
import AppScreen from './AppScreen';
import TaskList from './TaskList';

const rest = require('rest');
const mime = require('rest/interceptor/mime');
const client = rest.wrap(mime);

const baseUrl = 'localhost:8080';
const restUrl = `http://${baseUrl}`;

const initial = {
  user: JSON.parse(localStorage.getItem("camundaUser")),
  processDefs: null,
  bpmnForm: null,
  schema: null,
  processVariables: {},
  controlVariables: {},
  tasks: [],
  task: null,
  screen: "waiting"
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initial;
  }

  init = () => {
    if(this.state.user.username) {
      console.log("init");
      this.setState({screen: "home"});
    }
  }

  onAuthentication = (response) => {
    console.log(response);
    let user = response.entity;
    if(user && user.username) {
      localStorage.setItem("camundaUser", JSON.stringify(user));
      this.setState({user: user}, () => this.init());
    }
  }

  doAuthentication = (formData) => {
    let user = {
      username: formData.field_username,
      password: formData.field_password
    };
    client({
      path: `${restUrl}/authentication/login`,
      headers: {'Content-Type': 'application/json'},
      entity: user
    }).then(this.onAuthentication);
  }

  onLogout = () => {
    //stompClient.deactivate();
    this.setState({user: {userId: null}});
    localStorage.removeItem("camundaUser");
  }

  componentDidMount() {
    this.init();
  }

  render() {
    if(this.state.user && this.state.user.username) {
      // User is Authenticated
      if(this.state.screen === "waiting") {

        return (
          <AppScreen userId={this.state.user.username}
                     onlogout={this.onLogout}>
            <div>Please wait ...</div>
          </AppScreen>
        )

      } else if(this.state.screen === "home") {

        return (
          <AppScreen userId={this.state.user.username}
                     onlogout={this.onLogout}>
            <TaskList user={this.state.user}/>
          </AppScreen>
        )
      } else {

        return (
          <AppScreen userId={this.state.user.userId}
                     tasks={this.state.tasks}
                     onlogout={this.onLogout}
                     startProcessInstance={this.startProcessInstance}>
            <div>Hmm, not sure what to do?</div>
          </AppScreen>
        );

      }

    } else {
      // User is not Authenticated
      return (
        <Login
          data={this.state.processVariables}
          onSubmit={this.doAuthentication}
        />
      )
    }
  }
}

export default App;