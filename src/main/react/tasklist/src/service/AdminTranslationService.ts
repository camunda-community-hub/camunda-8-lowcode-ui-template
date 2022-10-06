import store, { AppThunk } from '../store';
import { loadStart, loadSuccess, setCurrentLanguage, setLanguageCode, setTranslations, setLanguageName, fail, silentfail } from '../store/features/translations/slice';
import api from './api';

export class AdminTranslationService {
  lastFetch: number = 0;
  getDefaultLn = (): any => {
    return {
      name: 'Language',
      code: 'code',
      translations: { tasks: "Tasks", processes: "Processes", open: "Open" },
      Content: ''
    }
  }
  getLanguages = (): AppThunk => async dispatch => {
    if (this.lastFetch < Date.now() - 5000) { 
      try {
        dispatch(loadStart());
        const { data } = await api.get<string[]>('/i18n/languages');
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
  new = (): AppThunk => async dispatch => {
    dispatch(setCurrentLanguage(this.getDefaultLn()));
  }
  open = (name:string): AppThunk => async dispatch => {
    api.get('/i18n/' + name).then(response => {
      dispatch(setCurrentLanguage(response.data));
    }).catch(error => {
      alert(error.message);
    })
  }
  delete = (name: string): AppThunk => async dispatch => {
    api.delete('/i18n/' + name).then(response => {
      dispatch(this.getLanguages());
    }).catch(error => {
      alert(error.message);
    })
  }
  setLanguage = (language: any): AppThunk => async dispatch => {
    dispatch(setCurrentLanguage(language));
  }
  setTranslations = (translations: any): AppThunk => async dispatch => {
    dispatch(setTranslations(translations));
  }
  setLanguageName = (languageName: string): AppThunk => async dispatch => {
    dispatch(setLanguageName(languageName));
  }
  setLanguageCode = (languageCode: string): AppThunk => async dispatch => {
    dispatch(setLanguageCode(languageCode));
  }
  saveCurrentLanguage = (): AppThunk => async dispatch => {
    let language = Object.assign({}, store.getState().translations.currentLanguage);
    api.post('/i18n', language).then(response => {
      dispatch(setCurrentLanguage(response.data));
    }).catch(error => {
      alert(error.message);
    })
  }
  getCurrentLanguage = (): any => {
    return store.getState().translations.currentLanguage;
  }
}

const adminTranslationService = new AdminTranslationService();

export default adminTranslationService;
