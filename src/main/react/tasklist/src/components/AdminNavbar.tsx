import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import authService from '../service/AuthService';
import adminFormService from '../service/AdminFormService';
import adminMailService from '../service/AdminMailService';
import adminThemeService from '../service/AdminThemeService';
import adminOrgService from '../service/AdminOrgService';
import adminTranslationService from '../service/AdminTranslationService';
import logo from '../assets/img/logo.svg'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import DataPreviewEditor from './DataPreviewEditor';
import FormPreview from './FormPreview';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from "react-i18next";

function AdminNavbar() {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.auth.data)
  const form = useSelector((state: any) => state.adminForms.currentForm)
  const formEditor = useSelector((state: any) => state.adminForms.formEditor)
  const mail = useSelector((state: any) => state.adminMails.currentMail)
  const theme = useSelector((state: any) => state.adminThemes.currentTheme)
  const language = useSelector((state: any) => state.translations.currentLanguage)
  const orgEnabled = useSelector((state: any) => state.adminOrg.enabled)

  const dispatch = useDispatch();
  const [showPreview, setShowPreview] = useState(false);

  const handleClose = () => setShowPreview(false);
  const handleShow = () =>  setShowPreview(true);
  useEffect(() => {
    dispatch(adminOrgService.checkIfEnabled());
  }, []);
  const logout = (event: any) => {
    dispatch(authService.signOut());
  };
  return (
    <>
      <nav className={form || mail || theme || language ? "navbar reduced navbar-light bg-dark" : "navbar navbar-light bg-light"} >
        <div className="container-fluid">
          <Link to="/home"><img height="50" src={logo} className="custom-logo" alt="Camunda" /></Link>
          <div>
            {form ?
              <InputGroup className="mb-3">
                {form.generator=='formJs' ?
                <Button variant="primary" onClick={handleShow}><i className="bi bi-eye"></i></Button> : <></>}
                  <Form.Control aria-label="Form name" placeholder="Form name" value={form.name} onChange={(evt) => dispatch(adminFormService.setFormName(evt.target.value))} />
                  <Button variant="primary" onClick={() => adminFormService.saveCurrentForm()}>{t("Save")}</Button>
                  <Button variant="secondary" onClick={() => dispatch(adminFormService.setForm(null))}><i className="bi bi-arrow-return-left"></i> {t("Back")}</Button>
              </InputGroup>
                :
                mail ?
                  <InputGroup className="mb-3">
                    <Form.Control aria-label="Mail template name" placeholder="Mail template name" value={mail.name} onChange={(evt) => dispatch(adminMailService.setMailName(evt.target.value))} />
                    <Button variant="primary" onClick={() => dispatch(adminMailService.saveCurrentMail())}>{t("Save")}</Button>
                    <Button variant="secondary" onClick={() => dispatch(adminMailService.setMail(null))}><i className="bi bi-arrow-return-left"></i> {t("Back")}</Button>
                  </InputGroup>
                  :
                  theme ?
                    <InputGroup className="mb-3">
                      <Form.Control aria-label="Theme name" placeholder="Theme name" value={theme.name} onChange={(evt) => dispatch(adminThemeService.setThemeName(evt.target.value))} />
                      <Button variant="primary" onClick={() => dispatch(adminThemeService.saveCurrentTheme())}>{t("Save")}</Button>
                      <Button variant="secondary" onClick={() => dispatch(adminThemeService.setTheme(null))}><i className="bi bi-arrow-return-left"></i> {t("Back")}</Button>
                    </InputGroup>
                    :
                    language ?
                      <InputGroup className="mb-3">
                        <Form.Control aria-label="Language name" placeholder="Language name" value={language.name} disabled/>
                        <Button variant="secondary" onClick={() => dispatch(adminTranslationService.setLanguage(null))}><i className="bi bi-arrow-return-left"></i> {t("Back")}</Button>
                      </InputGroup>
                      :
                    <div className="input-group mb-3 ">
                      <LanguageSelector></LanguageSelector>
                      <a className="btn btn-outline-secondary" onClick={logout}>{authService.getUser()!.username} <i className="bi bi-box-arrow-left"></i></a>
                    </div>
            }
          </div>
        </div>
        {!form && !mail && !theme && !language ?
          <div className="bg-primary menu">
            <NavLink className={({ isActive }) =>
              isActive ? "text-light menu-item selected" : "text-light menu-item"
            } to="/admin/forms">{t("Forms")}</NavLink>
            <NavLink className={({ isActive }) =>
              isActive ? "text-light menu-item selected" : "text-light menu-item"
            } to="/admin/mails">{t("Emails")}</NavLink>
            <NavLink className={({ isActive }) =>
              isActive ? "text-light menu-item selected" : "text-light menu-item"
            } to="/admin/feel">{t("Feel Tester")}</NavLink>
            <NavLink className={({ isActive }) =>
              isActive ? "text-light menu-item selected" : "text-light menu-item"
            } to="/admin/dmn">{t("DMN")}</NavLink>
            <NavLink className={({ isActive }) =>
              isActive ? "text-light menu-item selected" : "text-light menu-item"
            } to="/admin/templates">{t("Templates")}</NavLink>
            {orgEnabled && user!.profile === 'Admin' ?
              <NavLink className={({ isActive }) =>
                isActive ? "text-light menu-item selected" : "text-light menu-item"
              } to="/admin/users">{t("Users")}</NavLink>
              : <></>
            }
            {user!.profile === 'Admin' ?
              <>
                <NavLink className={({ isActive }) =>
                  isActive ? "text-light menu-item selected" : "text-light menu-item"
                } to="/admin/theme">{t("Theming")}</NavLink>
                <NavLink className={({ isActive }) =>
                  isActive ? "text-light menu-item selected" : "text-light menu-item"
                } to="/admin/translations">{t("Internationalization")}</NavLink>
              </>
              : <></>
            }
          </div>
          : <></>}
      </nav>
      {form && formEditor ?
        <Modal show={showPreview} onHide={handleClose} animation={false} fullscreen>
          <Modal.Header closeButton>
            <Modal.Title>{t("Preview form")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="card col"><DataPreviewEditor /></div>
              <div className="card col"><FormPreview formKey={null} schema={formEditor.getSchema()} variables={[]} disabled={false} /></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              {t("Close")}
            </Button>
          </Modal.Footer>
        </Modal>
        :
        <></>
      }
      </>
  );
}

export default AdminNavbar;
