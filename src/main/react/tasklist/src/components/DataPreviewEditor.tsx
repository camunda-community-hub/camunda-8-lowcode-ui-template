import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminFormService from '../service/AdminFormService';

function DataPreviewEditor() {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: any) => state.adminForms.currentForm)
 

  return (
    <div style={{ height: 'calc(100vh - 185px)' }} ><span className="form-label">Data preview value</span><textarea id="jsonEditor">{ currentForm.previewData }</textarea></div>
  );
}

export default DataPreviewEditor
