import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminThemeService from '../service/AdminThemeService';
import AdminThemeList from '../components/AdminThemeList';
import AdminThemeEdit from '../components/AdminThemeEdit';

function AdminThemes() {

  const theme = useSelector((state: any) => state.adminThemes.currentTheme)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(adminThemeService.getThemes());
  });

  return (
    theme ? <AdminThemeEdit/> : <AdminThemeList />
  );
}

export default AdminThemes;
