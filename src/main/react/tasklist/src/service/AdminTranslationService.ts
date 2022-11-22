import store, { AppThunk } from '../store';
import { loadStart, loadSuccess, setCurrentLanguage, setLanguageCode, setSiteTranslations, setFormsTranslations, setLanguageName, fail, silentfail } from '../store/features/translations/slice';
import api from './api';

export class AdminTranslationService {
  lastFetch: number = 0;
  getDefaultLn = (): any => {
    return {
      name: 'Language',
      code: 'code',
      siteTranslations: {
        "Any": "Any",
        "Any group": "Any group",
        "Any user": "Any users",
        "Assigned": "Assigned",
        "Assignee": "Assignee",
        "Back": "Back",
        "Canceled": "Canceled",
        "Claim": "Claim",
        "Close": "Close",
        "Completed": "Completed",
        "Created": "Created",
        "Delete": "Delete",
        "Dictionnary": "Dictionnary",
        "Download": "Download",
        "Duplicate": "Duplicate",
        "Emails": "Emails",
        "Feel Tester": "Feel Tester",
        "Forms": "Forms",
        "Generate": "Generate",
        "Generate from variables": "Generate from variables",
        "Group": "Group",
        "Group name": "Group name",
        "Groups": "Groups",
        "Internationalization": "Internationalization",
        "Language code": "Language code",
        "Language name": "Langue name",
        "Load from a file": "Load from a file",
        "Mail editor": "Mail editor",
        "Mail preview": "Mail preview",
        "Me": "Me",
        "My processes": "My processes",
        "Name": "Name",
        "New form": "New form",
        "New mail": "New mail",
        "New theme": "New theme",
        "New translation": "New translation",
        "No": "No",
        "Open": "Open",
        "Organization name": "Organization name",
        "Processes": "Processes",
        "Save": "Save",
        "Set as active": "Set as active",
        "State": "State",
        "Submit": "Submit",
        "Tasks": "Tasks",
        "Tasks filters": "Tasks filters",
        "Theme editor": "Theme editor",
        "Unclaim": "Unclaim",
        "Unsufficient privileges": "Unsufficient privileges",
        "Users": "Users",
        "Yes": "Yes"
      },
      formsTranslations: {}
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
  setSiteTranslations = (translations: any): AppThunk => async dispatch => {
    dispatch(setSiteTranslations(translations));
  }
  setFormsTranslations = (translations: any): AppThunk => async dispatch => {
    dispatch(setFormsTranslations(translations));
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
