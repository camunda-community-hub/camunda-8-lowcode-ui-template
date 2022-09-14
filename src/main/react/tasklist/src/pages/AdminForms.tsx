import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminFormService from '../service/AdminFormService';
import AdminFormList from '../components/AdminFormList';
import AdminFormEdit from '../components/AdminFormEdit';

function AdminForms() {

  const form = useSelector((state: any) => state.adminForms.currentForm)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(adminFormService.geForms());
  });

  return (
    form ? <AdminFormEdit /> : <AdminFormList />
  );
}

export default AdminForms;
