import store, { AppThunk } from '../store';
import { loadStart, loadSuccess, addOrganization, enabled, fail } from '../store/features/adminOrgs/slice';
import { Organization } from '../store/model';
import api from './api';

export class AdminOrgService {
  lastFetch: number = 0;
  checkIfEnabled = (): AppThunk => async dispatch => {
    if (store.getState().adminOrg.enabled == null) {
      dispatch(loadStart());
      const { data } = await api.get<any>('/organization/enabled');
      dispatch(enabled(data));
    }
  }
  getOrganizations = (): AppThunk => async dispatch => {
    if (this.lastFetch < Date.now() - 5000) { 
      try {
        dispatch(loadStart());
        const { data } = await api.get<Organization[]>('/organization');
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
  addOrganization = (): AppThunk => async dispatch => {
    dispatch(loadStart());
    const { data } = await api.post<Organization>('/organization');
    dispatch(addOrganization(data));
    this.lastFetch = Date.now();
  }
  setActive = (org: Organization): AppThunk => async dispatch => {
    dispatch(loadStart());
    const { data } = await api.post<Organization>('/organization/active/' + org.oldname);
    dispatch(this.getOrganizations());
  }
  save = (org: Organization): AppThunk => async dispatch => {
    dispatch(loadStart());
    const { data } = await api.put<Organization>('/organization/' + org.oldname, org);
    dispatch(this.getOrganizations());
  }
}

const adminOrgService = new AdminOrgService();

export default adminOrgService;
