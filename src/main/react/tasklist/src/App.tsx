import ReactDOM from "react-dom";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TasklistLayout from "./TasklistLayout";
import AdminLayout from "./AdminLayout";
import SimpleLayout from "./SimpleLayout"
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import TaskList from "./pages/TaskList";
import Undefined from "./pages/Undefined";
import Processes from "./pages/Processes";
import AdminUsers from "./pages/AdminUsers";
import AdminEmails from "./pages/AdminEmails";
import AdminForms from "./pages/AdminForms";
import './assets/css/bootstrap.min.css';
import './assets/css/bootstrap-icons-1.7.2.css';
import './assets/css/custom.css';
import './assets/css/login.css';
import '@camunda-community/form-js/dist/assets/form-js.css';
import authService from './service/AuthService'

function App() {

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.data)

  useEffect(() => {
    dispatch(authService.recoverFromStorage());
  });

  return (
    user && (user!.profile == 'Admin' || user!.profile == 'Editor') ?
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleLayout />}>
          <Route index element={<Welcome />} />
          <Route path="*" element={<Undefined />} />
        </Route>
          <Route path="tasklist" element={<TasklistLayout />}>
            <Route index element={<TaskList />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="processes" element={<Processes />} />
            <Route path="*" element={<Undefined />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminForms />} />
            <Route path="forms" element={<AdminForms />} />
            <Route path="mails" element={<AdminEmails />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<Undefined />} />
          </Route>
        </Routes>
      </BrowserRouter>
      :
      user ?
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SimpleLayout />}>
              <Route index element={<Welcome />} />
              <Route path="*" element={<Undefined />} />
            </Route>
            <Route path="tasklist" element={<TasklistLayout />}>
              <Route index element={<TaskList />} />
              <Route path="tasks" element={<TaskList />} />
              <Route path="processes" element={<Processes />} />
              <Route path="*" element={<Undefined />} />
            </Route>
            <Route path="admin" element={<SimpleLayout />}>
              <Route index element={<Login />} />
              <Route path="*" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
        :
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SimpleLayout />}>
              <Route index element={<Welcome />} />
              <Route path="*" element={<Undefined />} />
            </Route>
            <Route path="tasklist" element={<SimpleLayout />}>
              <Route index element={<Login />} />
              <Route path="*" element={<Login />} />
            </Route>
            <Route path="admin" element={<SimpleLayout />}>
              <Route index element={<Login />} />
              <Route path="*" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter >
  );
}

export default App;
