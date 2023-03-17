import store, { AppThunk } from '../store';
import { loadStart, loadSuccess, setCurrentForm, setFormName, setCurrentFormEditor, setCurrentFormBuilder, setCurrentFormPreview, fail, silentfail } from '../store/features/adminForms/slice';
import { FormEditor } from '@camunda-community/form-js-editor';
import { FormBuilder } from 'formiojs';
import api from './api';

export class AdminFormService {
  lastFetch: number = 0;
  getDefaultForm = (formType: string): any => {
    if (formType == 'formJs') {
      return {
        name: 'New Form',
        generator: formType,
        schema: {
          components: [],
          schemaVersion: 4,
          type: "default",
          id: "Form_" + Math.floor(1000000 + Math.random() * 9000000),
          executionPlatform: "Camunda Cloud",
          executionPlatformVersion: "1.1",
          exporter: {
            name: "Camunda Modeler",
            version: "5.0.0"
          }
        },
        previewData: '{}'
      }
    } else {
      return {
        name: 'New Form',
        generator: formType,
        schema: {
          "_id": Math.floor(1000000 + Math.random() * 9000000),
          "components": []
        },
        previewData: '{}'
      }
    }
  }
  geForms = (): AppThunk => async dispatch => {
    if (this.lastFetch < Date.now() - 5000) { 
      try {
        dispatch(loadStart());
        const { data } = await api.get<string[]>('/edition/forms/names');
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
  newForm = (formType: string): AppThunk => async dispatch => {
    dispatch(setCurrentForm(this.getDefaultForm(formType)));
  }
  openForm = (name:string): AppThunk => async dispatch => {
    api.get('/edition/forms/' + name).then(response => {
      let form = response.data;
      form.previewData = JSON.stringify(form.previewData, null, 2);

      dispatch(setCurrentForm(form));
    }).catch(error => {
      alert(error.message);
    })
  }
  deleteForm = (name: string): AppThunk => async dispatch => {
    api.delete('/edition/forms/' + name).then(response => {
      dispatch(this.geForms());
    }).catch(error => {
      alert(error.message);
    })
  }
  setForm = (form: any): AppThunk => async dispatch => {
    dispatch(setCurrentForm(form));
  }
  setFormName = (formName: string): AppThunk => async dispatch => {
    dispatch(setFormName(formName));
  }
  setFormEditor = (formEditor: FormEditor): AppThunk => async dispatch => {
    dispatch(setCurrentFormEditor(formEditor));
  }
  setFormBuilder = (formBuilder: FormBuilder): AppThunk => async dispatch => {
    dispatch(setCurrentFormBuilder(formBuilder));
  }
  saveCurrentForm = () => {
    let form = JSON.parse(JSON.stringify(store.getState().adminForms.currentForm));
    if (store.getState().adminForms.formEditor) {
      form.schema = store.getState().adminForms.formEditor.getSchema();
    } else {
      console.log(store.getState().adminForms.formBuilder);
      console.log(store.getState().adminForms.formBuilder._form);
      form.schema = store.getState().adminForms.formBuilder._form;
    }
    form.previewData = JSON.parse(form.previewData);
    api.post('/edition/forms', form).then(response => {
      form.modified = response.data.modified;
    }).catch(error => {
      alert(error.message);
    })
    //this.$store.form.previewData = JSON.stringify(this.$store.form.previewData, null, 2);
  }
  setFormPreview = (data: string): AppThunk => async dispatch => {
    dispatch(setCurrentFormPreview(data));
  }
  getCurrentForm = (): any => {
    return store.getState().adminForms.currentForm;
  }
}

const adminFormService = new AdminFormService();

export default adminFormService;
