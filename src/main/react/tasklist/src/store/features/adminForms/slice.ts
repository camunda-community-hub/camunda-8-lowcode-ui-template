import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormEditor } from '@camunda-community/form-js-editor';

interface AdminFormsState {
  forms: string[] | null;
  currentForm: any;
  formEditor: any;
  loading: boolean;
  error: string | null;
}

const initialState: AdminFormsState = {
  forms: null,
  currentForm: null,
  formEditor: null,
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
    },
    setCurrentFormEditor: (state: AdminFormsState, action: PayloadAction<any>) => {
      state.loading = false;
      state.formEditor = action.payload;
    },
  },
});

export const {
  loadStart,
  loadSuccess,
  setCurrentForm,
  setCurrentFormEditor,
  fail,
  silentfail
} = adminFormsSlice.actions;

export default adminFormsSlice.reducer;
