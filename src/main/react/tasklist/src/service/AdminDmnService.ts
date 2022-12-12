import store, { AppThunk } from '../store';
import { loadStart, loadSuccess, setCurrentDmn, fail } from '../store/features/adminDmns/slice';
import api from './api';

export class AdminDmnService {
  lastFetch: number = 0;
  getDefaultDmn = ():any => {
    return {
      name: 'New Dmn',
      definition:`<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="Definitions_00ovzg8" name="DRD" namespace="http://camunda.org/schema/1.0/dmn" xmlns:modeler="http://camunda.org/schema/modeler/1.0" exporter="Camunda Modeler" exporterVersion="5.0.0" modeler:executionPlatform="Camunda Cloud" modeler:executionPlatformVersion="8.0.0">
  <decision id="decision1" name="Decision 1">
    <decisionTable id="DecisionTable_07iaaa7">
      <input id="Input_1">
        <inputExpression id="InputExpression_1" typeRef="string">
          <text></text>
        </inputExpression>
      </input>
      <output id="Output_1" typeRef="string" />
    </decisionTable>
  </decision>
  <dmndi:DMNDI>
    <dmndi:DMNDiagram>
      <dmndi:DMNShape dmnElementRef="decision1">
        <dc:Bounds height="80" width="180" x="160" y="100" />
      </dmndi:DMNShape>
    </dmndi:DMNDiagram>
  </dmndi:DMNDI>
</definitions>`,
      decisionId: 'decision1',
      contextData: '{}'
    }
  }
  getDmns = (): AppThunk => async dispatch => {
    if (this.lastFetch < Date.now() - 5000) { 
      try {
        dispatch(loadStart());
        const { data } = await api.get<string[]>('/dmn/names');
        dispatch(loadSuccess(data));
      } catch(error: any) {
        if (error.response) {
          // The request was made. server responded out of range of 2xx
          dispatch(fail(error.response.data.message));
        } else if (error.request) {
          // The request was made but no response was received
          dispatch(fail('ERROR_NETWORK'));
        } else {
          // Something happened in setting up the request that triggered an Error
          console.warn('Error', error.message);
          dispatch(fail(error.toString()));
        }
      }
      this.lastFetch = Date.now();
    }
  }
  newDmn = (): AppThunk => async dispatch => {
    dispatch(setCurrentDmn(this.getDefaultDmn()));
  }
  openDmn = (name:string): AppThunk => async dispatch => {
    api.get('/dmn/' + name).then(response => {
      let dmn = response.data;

      dispatch(setCurrentDmn(dmn));
    }).catch(error => {
      alert(error.message);
    })
  }
  delete = (name: string): AppThunk => async dispatch => {
    api.delete('/dmn/' + name).then(response => {
      dispatch(this.getDmns());
    }).catch(error => {
      alert(error.message);
    })
  }
  setDmn = (dmn: any): AppThunk => async dispatch => {
    dispatch(setCurrentDmn(dmn));
  }

  save = (dmn:any) => {
    api.post('/dmn', dmn).then(response => {
      dmn.modified = response.data.modified;
    }).catch(error => {
      alert(error.message);
    })
  }

  deploy = (dmn:any) => {
    api.post('/dmn/deploy', dmn).then(response => {
      dmn.deploymentKey = response.data;
      alert('Deployment OK :' + dmn.deploymentKey);
    }).catch(error => {
      alert(error.message);
    })
  }

  getCurrentDmn = (): any => {
    return store.getState().adminDmns.currentDmn;
  }
}

const adminDmnService = new AdminDmnService();

export default adminDmnService;
