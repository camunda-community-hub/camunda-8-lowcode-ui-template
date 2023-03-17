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
import Restricted from "./pages/Restricted";
import Processes from "./pages/Processes";
import AdminUsers from "./pages/AdminUsers";
import AdminTranslations from "./pages/AdminTranslations";
import AdminEmails from "./pages/AdminEmails";
import AdminForms from "./pages/AdminForms";
import AdminThemes from './pages/AdminThemes';
import FeelTester from './pages/FeelTester';
import AdminDmns from './pages/AdminDmns';
import WorkerList from './pages/WorkerList';
import ElementTemplate from './pages/ElementTemplate';
import './assets/css/bootstrap.min.css';
import './assets/css/bootstrap-icons-1.7.2.css';
import 'formiojs/dist/formio.full.min.css'
import '@camunda-community/form-js/dist/assets/form-js.css';
import '@camunda-community/form-js/dist/assets/form-js-editor.css';
import '@camunda-community/form-js/dist/assets/dragula.css';
import '@camunda-community/form-js/dist/assets/properties-panel.css';
import 'dmn-js/dist/assets/diagram-js.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-decision-table-controls.css';
import 'dmn-js/dist/assets/dmn-js-drd.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn.css';
import 'dmn-js-properties-panel/dist/assets/dmn-js-properties-panel.css';
import 'dmn-js-properties-panel/dist/assets/properties-panel.css';
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
            <Route path="processes" element={<Processes />} />
            <Route path="*" element={<Undefined />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminForms />} />
            <Route path="forms" element={<AdminForms />} />
            <Route path="mails" element={<AdminEmails />} />
            <Route path="theme" element={<AdminThemes />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="translations" element={<AdminTranslations />} />
            <Route path="feel" element={<FeelTester />} />
            <Route path="dmn" element={<AdminDmns />} />
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
