import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormEditor } from '@camunda-community/form-js-editor';

interface AdminFormsState {
  forms: string[] | null;
  currentForm: any;
  formEditor: any;
  formBuilder: any;
  previewData: string;
  loading: boolean;
  error: string | null;
}

const initialState: AdminFormsState = {
  forms: null,
  currentForm: null,
  formEditor: null,
  formBuilder: null,
  previewData: '{}',
  loading: false,
  error: null,
};

const adminFormsSlice = createSlice({
  name: 'adminForms',
  initialState,
  reducers: {
    loadStart: (state: AdminFormsState) => {
      state.loading = true;
    },
    fail: (state: AdminFormsState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    silentfail: (state: AdminFormsState) => {
      state.loading = false;
    },
    loadSuccess: (state: AdminFormsState, action: PayloadAction<string[]>) => {
      state.loading = false;
      state.forms = action.payload;
    },
    setCurrentForm: (state: AdminFormsState, action: PayloadAction<any>) => {
      state.loading = false;
      state.currentForm = action.payload;
      if (state.currentForm != null) {
        state.previewData = action.payload.previewData;
      }
    },
    setFormName: (state: AdminFormsState, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    setCurrentFormPreview: (state: AdminFormsState, action: PayloadAction<string>) => {
      state.currentForm.previewData = action.payload;
      state.previewData = action.payload;
    },
    setCurrentFormEditor: (state: AdminFormsState, action: PayloadAction<any>) => {
      state.formEditor = action.payload;
      state.formBuilder = null;
    },
    setCurrentFormBuilder: (state: AdminFormsState, action: PayloadAction<any>) => {
      state.formBuilder = action.payload;
      state.formEditor = null;
    },
  },
});

export const {
  loadStart,
  loadSuccess,
  setCurrentForm,
  setFormName,
  setCurrentFormEditor,
  setCurrentFormBuilder,
  setCurrentFormPreview,
  fail,
  silentfail
} = adminFormsSlice.actions;

export default adminFormsSlice.reducer;
