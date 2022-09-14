import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import adminFormService from '../service/AdminFormService';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

function DataPreviewEditor() {
  const dispatch = useDispatch();
  const currentForm = adminFormService.getCurrentForm();
 
  const onChange = React.useCallback((value: string, viewUpdate: any) => {
    //currentForm.previewData = value;
    dispatch(adminFormService.setFormPreview(value));
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 185px)' }} >
      <span className="form-label">Data preview value</span>
      <CodeMirror
        value={currentForm.previewData}
        extensions={[json()]}
        onChange={onChange}
      />
    </div>
  );
}

export default DataPreviewEditor
