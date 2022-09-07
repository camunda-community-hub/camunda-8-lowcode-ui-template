import { useSelector } from 'react-redux';
import store, { AppThunk } from '../store';
import { RootState } from '../store/rootReducer';
import { authStart, signInSuccess, signOutSuccess, fail, silentfail } from '../store/features/auth/slice';
import { IUser } from '../store/model';
import api from './api';

export class AuthService {

  isAuthenticated = (): boolean => useSelector(
    (state: RootState) => state.auth.data ? true : false,
  );
  getUser = (): IUser | null => {
    return store.getState().auth.data;
  }
  getUserId = ():number|null => {
    return store.getState().auth.data!.id;
  }
  recoverFromStorage = (): AppThunk => async dispatch => {
    let storedUser = localStorage.getItem('camundaUser');
    if (storedUser) {

      let user:IUser = JSON.parse(storedUser);
      
      if (user) {
        dispatch(signInSuccess(user));
      }
    }
  }

  signIn = (username: string, password: string): AppThunk => async dispatch => {
    try {
      dispatch(authStart());
          
      const { data } = await api.post<IUser>('/authentication/login', { 'username': username, 'password': password });
      api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
      localStorage.setItem('camundaUser', JSON.stringify(data));
      dispatch(signInSuccess(data));
    } catch (error:any) {
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
      
  signOut = (): AppThunk => async dispatch => {
    try {
      api.defaults.headers.common['Authorization'] = '';
      localStorage.removeItem('camundaUser');
      dispatch(signOutSuccess());
    } catch (err:any) {
      dispatch(fail(err.toString()));
    }
  };

}

const authService = new AuthService();

export default authService;