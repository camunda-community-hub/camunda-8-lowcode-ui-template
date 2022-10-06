import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminTranslationService from '../service/AdminTranslationService';
import AdminTranslationList from '../components/AdminTranslationList';
import AdminTranslationEdit from '../components/AdminTranslationEdit';

function AdminTranslations() {

  const language = useSelector((state: any) => state.translations.currentLanguage)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(adminTranslationService.getLanguages());
  });

  return (
    language ? <AdminTranslationEdit /> : <AdminTranslationList />
  );
}

export default AdminTranslations;
