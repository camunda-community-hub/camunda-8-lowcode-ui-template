import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';
import type {} from 'redux-thunk/extend-redux';
import FormResolver from './FormResolver';


function InstantiationForm(props: any) {
  const currentProcess = useSelector((state: any) => state.process.currentProcess)
  const currentSchema = useSelector((state: any) => state.process.currentFormSchema)

  return (
	currentProcess ?
	  <div className="card taskform">
		<h5 className="card-title bg-primary text-light" > {currentProcess.name}</h5>
        <FormResolver formKey={null} schema={currentSchema} variables={undefined} disabled={false}></FormResolver>
	  </div> : <div />
  )
  
}

export default InstantiationForm;


