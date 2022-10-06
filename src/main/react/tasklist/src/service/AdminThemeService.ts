import store, { AppThunk } from '../store';
import { loadStart, loadSuccess, setCurrentTheme, setContent, setVariables, setThemeName, fail, silentfail } from '../store/features/adminThemes/slice';
import api from './api';

export class AdminThemeService {
  lastFetch: number = 0;
  getDefaultTheme = (): any => {
    return {
      name: 'NewTheme',
      variables: { primary: "#0d6efd", secondary: "#6c757d", success: "#198754", danger: "#dc3545", warning: "#ffc107", info: "#0dcaf0", light: "#f8f9fa", dark: "#212529" },
      Content: ''
    }
  }
  getThemes = (): AppThunk => async dispatch => {
    if (this.lastFetch < Date.now() - 5000) { 
      try {
        dispatch(loadStart());
        const { data } = await api.get<string[]>('/themes/names');
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
  newTheme = (): AppThunk => async dispatch => {
    dispatch(setCurrentTheme(this.getDefaultTheme()));
  }
  openTheme = (name:string): AppThunk => async dispatch => {
    api.get('/themes/' + name).then(response => {
      dispatch(setCurrentTheme(response.data));
    }).catch(error => {
      alert(error.message);
    })
  }
  deleteTheme = (name: string): AppThunk => async dispatch => {
    api.delete('/themes/' + name).then(response => {
      dispatch(this.getThemes());
    }).catch(error => {
      alert(error.message);
    })
  }
  setTheme = (theme: any): AppThunk => async dispatch => {
    dispatch(setCurrentTheme(theme));
  }
  setContent = (content: string): AppThunk => async dispatch => {
    dispatch(setContent(content));
  }
  setThemeName = (themeName: string): AppThunk => async dispatch => {
    dispatch(setThemeName(themeName));
  }
  saveCurrentTheme = (): AppThunk => async dispatch => {
    let theme = Object.assign({}, store.getState().adminThemes.currentTheme);
    api.post('/themes', theme).then(response => {
      dispatch(setCurrentTheme(response.data));
    }).catch(error => {
      alert(error.message);
    })
  }
  generateCss = (variables: any): AppThunk => async dispatch => {
    dispatch(setVariables(variables));
    api.post('/themes/generate', variables).then(response => {
      dispatch(setContent(response.data));
    }).catch(error => {
      alert(error.message);
    })
  }
  getCurrentTheme = (): any => {
    return store.getState().adminThemes.currentTheme;
  }
  setActive = (theme: any): AppThunk => async dispatch => {
    dispatch(loadStart());
    const { data } = await api.post<any>('/themes/active/' + theme.name);
    dispatch(setCurrentTheme(data));
  }
}

const adminThemeService = new AdminThemeService();

export default adminThemeService;
