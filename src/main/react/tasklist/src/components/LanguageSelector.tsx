import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from "react-i18next";
import adminTranslationService from '../service/AdminTranslationService';

function LanguageSelector() {
  const dispatch = useDispatch();
  const languages = useSelector((state: any) => state.translations.languages);

  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => () => {
    i18n.changeLanguage(language);
    localStorage.setItem('camundLocale', language);
  };

  useEffect(() => {
    dispatch(adminTranslationService.getLanguages());
  });

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-languages"><i className="bi bi-translate"></i></Dropdown.Toggle>
      <Dropdown.Menu>
        {languages ? languages.map((language: any) => <Dropdown.Item key={language.code} onClick={changeLanguage(language.code)}>{ language.name }</Dropdown.Item>) : <></>}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LanguageSelector;
