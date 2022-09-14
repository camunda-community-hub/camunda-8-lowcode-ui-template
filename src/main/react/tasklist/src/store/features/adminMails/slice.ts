import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminMailsState {
  mails: string[] | null;
  currentMail: any;
  loading: boolean;
  error: string | null;
}

const initialState: AdminMailsState = {
  mails: null,
  currentMail: null,
  loading: false,
  error: null,
};

const adminMailsSlice = createSlice({
  name: 'adminMails',
  initialState,
  reducers: {
    loadStart: (state: AdminMailsState) => {
      state.loading = true;
    },
    fail: (state: AdminMailsState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    silentfail: (state: AdminMailsState) => {
      state.loading = false;
    },
    loadSuccess: (state: AdminMailsState, action: PayloadAction<string[]>) => {
      state.loading = false;
      state.mails = action.payload;
    },
    setCurrentMail: (state: AdminMailsState, action: PayloadAction<any>) => {
      state.loading = false;
      state.currentMail = action.payload;
    },
    setMailName: (state: AdminMailsState, action: PayloadAction<string>) => {
      state.currentMail.name = action.payload;
    },
    setHtmlTemplate: (state: AdminMailsState, action: PayloadAction<string>) => {
      state.currentMail.htmlTemplate = action.payload;
    },
  },
});

export const {
  loadStart,
  loadSuccess,
  setCurrentMail,
  setMailName,
  setHtmlTemplate,
  fail,
  silentfail
} = adminMailsSlice.actions;

export default adminMailsSlice.reducer;
