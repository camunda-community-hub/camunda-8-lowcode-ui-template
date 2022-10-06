import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminThemesState {
  Themes: string[] | null;
  lastUpdate: Date;
  currentTheme: any;
  loading: boolean;
  error: string | null;
}

const initialState: AdminThemesState = {
  Themes: null,
  lastUpdate: new Date(),
  currentTheme: null,
  loading: false,
  error: null,
};

const adminThemesSlice = createSlice({
  name: 'adminThemes',
  initialState,
  reducers: {
    loadStart: (state: AdminThemesState) => {
      state.loading = true;
    },
    fail: (state: AdminThemesState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    silentfail: (state: AdminThemesState) => {
      state.loading = false;
    },
    loadSuccess: (state: AdminThemesState, action: PayloadAction<string[]>) => {
      state.loading = false;
      state.Themes = action.payload;
    },
    setCurrentTheme: (state: AdminThemesState, action: PayloadAction<any>) => {
      state.loading = false;
      state.currentTheme = action.payload;
      state.lastUpdate = new Date();
    },
    setThemeName: (state: AdminThemesState, action: PayloadAction<string>) => {
      state.currentTheme.name = action.payload;
    },
    setContent: (state: AdminThemesState, action: PayloadAction<string>) => {
      state.currentTheme.content = action.payload;
    },
    setVariables: (state: AdminThemesState, action: PayloadAction<any>) => {
      state.currentTheme.variables = action.payload;
    },
  },
});

export const {
  loadStart,
  loadSuccess,
  setCurrentTheme,
  setThemeName,
  setContent,
  setVariables,
  fail,
  silentfail
} = adminThemesSlice.actions;

export default adminThemesSlice.reducer;
