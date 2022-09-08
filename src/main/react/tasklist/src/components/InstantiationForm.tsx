import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';
import type {} from 'redux-thunk/extend-redux';
import FormViewer from './FormViewer';


function InstantiationForm(props: any) {
  const currentProcess = useSelector((state: any) => state.process.currentProcess)
  const currentSchema = useSelector((state: any) => state.process.currentFormSchema)

  return (
	currentProcess ?
	  <div className="card taskform">
		<h5 className="card-title" > {currentProcess.name}</h5>
		<FormViewer schema={currentSchema} variables={undefined} disabled={false}></FormViewer>
	  </div> : <div />
  )
  
}

export default InstantiationForm;


