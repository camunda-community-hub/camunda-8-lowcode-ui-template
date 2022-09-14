import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminMailService from '../service/AdminMailService';
import AdminMailList from '../components/AdminMailList';
import AdminMailEdit from '../components/AdminMailEdit';

function AdminEmails() {


  const mail = useSelector((state: any) => state.adminMails.currentMail)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(adminMailService.geMails());
  });

  return (
    mail ? <AdminMailEdit/> : <AdminMailList />
  );
}

export default AdminEmails;
