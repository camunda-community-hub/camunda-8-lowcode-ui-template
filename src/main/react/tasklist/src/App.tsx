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
import TaskForm from "./pages/TaskForm";
import Undefined from "./pages/Undefined";
import Restricted from "./pages/Restricted";
import Processes from "./pages/Processes";
import AdminUsers from "./pages/AdminUsers";
import AdminTranslations from "./pages/AdminTranslations";
import AdminEmails from "./pages/AdminEmails";
import AdminTasklist from "./pages/AdminTasklist";
import AdminForms from "./pages/AdminForms";
import AdminThemes from './pages/AdminThemes';
import WorkerList from './pages/WorkerList';
import ElementTemplate from './pages/ElementTemplate';
import './assets/css/bootstrap.min.css';
import './assets/css/bootstrap-icons-1.7.2.css';
import 'formiojs/dist/formio.full.min.css'
//import '@camunda-community/form-js/dist/assets/form-js.css';
import './assets/css/community-formjs-expurged.css';
import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/dragula.css';
import '@bpmn-io/form-js/dist/assets/properties-panel.css';
import './assets/css/custom.css';
import './assets/css/login.css';
import authService from './service/AuthService'

function App() {

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.data);

  useEffect(() => {
    dispatch(authService.retrieveConnectedUser());
  }, []);

  return (
    user && (user!.profile == 'Admin' || user!.profile == 'Editor') ?
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimpleLayout />}>
            <Route index element={<Welcome />} />
            <Route path="home" element={<Welcome />} />
            <Route path="*" element={<Undefined />} />
          </Route>
          <Route path="tasklist" element={<TasklistLayout />}>
            <Route index element={<TaskList />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="taskForm" element={<TaskForm />} />
            <Route path="processes" element={<Processes />} />
            <Route path="*" element={<Undefined />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminForms />} />
            <Route path="forms" element={<AdminForms />} />
            <Route path="mails" element={<AdminEmails />} />
            <Route path="theme" element={<AdminThemes />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="tasklistconf" element={<AdminTasklist/> }/>
            <Route path="translations" element={<AdminTranslations />} />
            <Route path="templates" element={<WorkerList />} />
            <Route path="elementTemplate/*" element={<ElementTemplate />} />
            <Route path="*" element={<Undefined />} />
          </Route>
        </Routes>
      </BrowserRouter>
      :
      user && user!.profile ?
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SimpleLayout />}>
              <Route index element={<Welcome />} />
              <Route path="home" element={<Welcome />} />
              <Route path="*" element={<Undefined />} />
            </Route>
            <Route path="tasklist" element={<TasklistLayout />}>
              <Route index element={<TaskList />} />
              <Route path="tasks" element={<TaskList />} />
              <Route path="taskForm" element={<TaskForm />} />
              <Route path="processes" element={<Processes />} />
              <Route path="*" element={<Undefined />} />
            </Route>
            <Route path="admin" element={<SimpleLayout />}>
              <Route index element={<Restricted />} />
              <Route path="*" element={<Restricted />} />
            </Route>
          </Routes>
        </BrowserRouter>
        :
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SimpleLayout />}>
              <Route index element={<Welcome />} />
              <Route path="home" element={<Welcome />} />
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
