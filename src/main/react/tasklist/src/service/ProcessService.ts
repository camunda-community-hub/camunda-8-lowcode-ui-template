import store, { AppThunk } from '../store';
import { remoteLoading, remoteProcessesLoadingSuccess, remoteLoadingFail, setFormSchema, setProcess } from '../store/features/processes/slice';
import { IProcess } from '../store/model';
import api from './api';

export class ProcessService {

  lastFetchProcesses: number = 0;

  getProcessBpmnId = ():string|null => {
    let process:IProcess|null = store.getState().process.currentProcess;
    return process ? process.bpmnProcessId : null;
  }
  getStartProcessesUrl = ():string|null => {
    let bpmnId:string|null = this.getProcessBpmnId();
    if (bpmnId!=null) {
      return '/process/'+bpmnId+'/start';
    }
    return null;
  }
  
  fetchProcesses = (): AppThunk => async dispatch => {
    if (this.lastFetchProcesses < Date.now() - 10000) { 
      try {
        dispatch(remoteLoading());
        const { data } = await api.get<IProcess[]>('/process/definition/latest');

        dispatch(remoteProcessesLoadingSuccess(data));
      } catch (err: any) {
        dispatch(remoteLoadingFail(err.toString()));
      }
      this.lastFetchProcesses = Date.now();
    }
  }
  
  setProcess = (process: IProcess): AppThunk => async dispatch => {
    let url = '/forms/instanciation/' + process.bpmnProcessId;
    api.get(url).then(response => {
      dispatch(setFormSchema(response.data));
    }).catch(error => {
      alert(error.message);
    })
    dispatch(setProcess(process));
  };
  
  getCurrentProcess = (): IProcess|null => {
    return store.getState().process.currentProcess;
  }
  getProcesses = (): IProcess[] => {
    return store.getState().process.processes;
  }
  instantiate = (data: any): AppThunk => async dispatch => {
    api.post(this.getStartProcessesUrl()!, data).then(response => {
      dispatch(setProcess(null));
    }).catch(error => {
      alert(error.message);
    })
  }
}

const processService = new ProcessService();

export default processService;
