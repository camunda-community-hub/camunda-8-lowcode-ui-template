import ReactDOM from "react-dom";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Login from "./pages/Login";
import TaskList from "./pages/TaskList";
import Undefined from "./pages/Undefined";
import Processes from "./pages/Processes";
import './assets/css/bootstrap.min.css';
import './assets/css/bootstrap-icons-1.7.2.css';
import './assets/css/custom.css';
import './assets/css/login.css';
import '@camunda-community/form-js/dist/assets/form-js.css';
import authService from './service/AuthService'
import taskService from './service/TaskService';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { env } from './env';

const connectStompClient = () => {
  let myStompClient = Stomp.client(`ws://${env.backend}/ws`);
  console.log(myStompClient);

  myStompClient.onStompError = function (frame) {
    console.log('STOMP error');
  };

  return myStompClient;
}

const stompClient = connectStompClient();

function App() {

  const dispatch = useDispatch();


  const onUserTaskReadyWS = (message: any) => {
    let task = JSON.parse(message.body);
    // Update the list of tasks
    dispatch(taskService.insertNewTask(task));
  }

  const connectStomp = () => {
    stompClient.onConnect = function (frame) {
      stompClient!.subscribe("/topic/" + authService.getUser()!.username + "/userTask", onUserTaskReadyWS);
      stompClient!.subscribe("/topic/userTask", onUserTaskReadyWS);
    };
    stompClient.activate();
  }

  useEffect(() => {
    dispatch(authService.recoverFromStorage());
    connectStomp();
  });

  return (
    authService.isAuthenticated() ?
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TaskList />} />
          <Route path="/tasklist/processes" element={<Processes />} />
          <Route path="/tasklist/home" element={<TaskList />} />
          <Route path="/tasklist/index.html" element={<TaskList />} />
          <Route path="*" element={<Undefined />} />
          </Route>
      </Routes>
    </BrowserRouter> : <Login/>
  );
}

export default App;
