import store, { AppThunk } from '../store';
import { loadStart, loadSuccess, setCurrentTheme, setVariables, fail, silentfail } from '../store/features/adminThemes/slice';
import api from './api';

export class AdminThemeService {
  lastFetch: number = 0;
  getDefaultTheme = (): any => {
    return {
      name: 'NewTheme',
      variables: { primary: "#0d6efd", secondary: "#6c757d", success: "#198754", danger: "#dc3545", warning: "#ffc107", info: "#0dcaf0", light: "#f8f9fa", dark: "#212529" },
      content: '',
      colors: '',
      logo: 'camunda.svg',
      logoCss: 'height:50px; border:0px;',
      background: 'background.jfif'
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
  getLogos = async (): Promise<string[]> => {
   
      try {
        const { data } = await api.get<string[]>('/themes/logos');
        return data
      } catch (error: any) {
        console.warn("Error fetching logos");
      }
    return [];
  }
  uploadLogo = async (file: any): Promise<any> => {

    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<any>('/themes/logo', formData);
    return data;
  }
  getBgs = async (): Promise<string[]> => {

    try {
      const { data } = await api.get<string[]>('/themes/bgs');
      return data
    } catch (error: any) {
      console.warn("Error fetching bgs");
    }
    return [];
  }
  uploadBg = async (file: any): Promise<any> => {

    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<any>('/themes/bg', formData);
    return data;
  }
  newTheme = (): AppThunk => async dispatch => {
    dispatch(setCurrentTheme(this.getDefaultTheme()));
  }
  openTheme = (name:string): AppThunk => async dispatch => {
    api.get('/themes/' + name).then(response => {
      dispatch(setCurrentTheme(response.data));
      console.log(response.data);
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
  setThemeName = (name: string): AppThunk => async dispatch => {
    let theme = Object.assign({}, store.getState().adminThemes.currentTheme);
    theme.name = name;
    dispatch(setCurrentTheme(theme));
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
      let theme = Object.assign({}, store.getState().adminThemes.currentTheme);
      theme.colors = response.data;
      dispatch(setCurrentTheme(theme));
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
