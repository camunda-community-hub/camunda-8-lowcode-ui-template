
import store, { AppThunk } from '../store';
import { authStart, signInSuccess, signOutSuccess, fail, silentfail } from '../store/features/auth/slice';
import { IUser } from '../store/model';
import api from './api';
import { env } from '../env';
import taskService from './TaskService';

export class AuthService {

  getUser = (): IUser | null => {
    return store.getState().auth.data;
  }
  retrieveConnectedUser = (): AppThunk => async dispatch => {
    if (!store.getState().auth.data) {
      dispatch(this.isAlreadyAuthenticated());
    }
    if (!store.getState().auth.data) {
      dispatch(this.recoverFromStorage());
      if (store.getState().auth.data) {
        try {
          const { data } = await api.get<IUser>('/auth/user');

          dispatch(this.setUser(data));
        }
        catch (error: any) {
          dispatch(this.signOut());
        }
      }
    }
  }
  isAlreadyAuthenticated = (): AppThunk => async dispatch => {
    try {
      const { data } = await api.get<IUser>('/auth/user');
      dispatch(this.setUser(data));
    }
    catch (error: any) {
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
  }
  recoverFromStorage = (): AppThunk => async dispatch => {
    if (!store.getState().auth.data) {
      let storedUser = localStorage.getItem('camundaTasklistUser');
      if (storedUser) {

        let user: IUser = JSON.parse(storedUser);

        if (user) {
          dispatch(this.setUser(user));
        }
      }
    }
  }

  signIn = (username: string, password: string): AppThunk => async dispatch => {
    try {
      dispatch(authStart());

      const { data } = await api.post<IUser>('/auth/login', { 'username': username, 'password': password });

      dispatch(this.setUser(data));
    } catch (error: any) {
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
  };

  setUser = (user: IUser): AppThunk => async dispatch => {
    if (user.token) {
      api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    }
    dispatch(taskService.filterOnAssignee(user.username));
    localStorage.setItem('camundaTasklistUser', JSON.stringify(user));
    dispatch(signInSuccess(user));
    dispatch(taskService.connectToWebSockets(user.username));
  };

  signOut = (): AppThunk => async dispatch => {
    try {
      if ("oauth2" == store.getState().auth.data?.token) {
        window.location.replace(env.backend + '/logout');
      }
      await api.get<IUser>('/auth/logout');
      api.defaults.headers.common['Authorization'] = '';
      localStorage.removeItem('camundaTasklistUser');
      try {
        taskService.disconnectFromWebScokets();
      } catch (error: any) {
        console.warn('Error', error.message);
      }
      window.location.reload();
    } catch (err: any) {
      dispatch(fail(err.toString()));
    }
  };

}

const authService = new AuthService();

export default authService;
