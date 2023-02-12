import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {} from 'redux-thunk/extend-redux';
import processService from '../service/ProcessService';
import { IProcess } from '../store/model';


function ProcessList() {
  const dispatch = useDispatch();
  const processes = useSelector((state: any) => state.process.processes)
  useEffect(() => {
    dispatch(processService.fetchProcesses());
  });
  const openProcess = (process: IProcess) => {
    dispatch(processService.setProcess(process));
  }
  
  return (
    <div>
      {processes && processes.map((process: IProcess) =>
        <div className="card" key={process.key}>
          <div className="card-body" key={process.key} onClick={() => openProcess(process)}>
            <h5 className="card-title text-primary">{process.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">version {process.version}</h6>
          </div>
        </div>)}
    </div>
  )
  
}

export default ProcessList;
