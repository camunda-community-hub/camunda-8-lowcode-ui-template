import store, { AppThunk } from '../store';
import { loadStart, loadSuccess, fail } from '../store/features/workers/slice';
import api from './api';

export class EltTemplateService {
  lastFetch: number = 0;

  getWorkers = (): AppThunk => async dispatch => {
    if (this.lastFetch < Date.now() - 500) { 
      try {
        dispatch(loadStart());
        const { data } = await api.get<any[]>('/elttemplates');
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
  getEltTemplate = async (worker: string): Promise<any> => {
    let { data } = await api.get('/elttemplates/' + worker);
    return data;
  }
  saveTemplate = async (worker: string|null, template: any): Promise<any> => {
    api.post('/elttemplates/' + worker, template).then(response => {
    }).catch(error => {
      alert(error.message);
    })
  }
}

const eltTemplateService = new EltTemplateService();

export default eltTemplateService;
