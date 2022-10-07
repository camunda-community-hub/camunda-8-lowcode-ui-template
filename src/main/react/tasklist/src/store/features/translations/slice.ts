import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TranslationsState {
  languages: any[] | null;
  lastUpdate: Date;
  currentLanguage: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: TranslationsState = {
  languages: null,
  lastUpdate: new Date(),
  currentLanguage: null,
  loading: false,
  error: null,
};

const translationsSlice = createSlice({
  name: 'translations',
  initialState,
  reducers: {
    loadStart: (state: TranslationsState) => {
      state.loading = true;
    },
    fail: (state: TranslationsState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    silentfail: (state: TranslationsState) => {
      state.loading = false;
    },
    loadSuccess: (state: TranslationsState, action: PayloadAction<string[]>) => {
      state.loading = false;
      state.languages = action.payload;
    },
    setCurrentLanguage: (state: TranslationsState, action: PayloadAction<any>) => {
      state.loading = false;
      state.currentLanguage = action.payload;
      state.lastUpdate = new Date();
    },
    setLanguageName: (state: TranslationsState, action: PayloadAction<string>) => {
      state.currentLanguage.name = action.payload;
    },
    setLanguageCode: (state: TranslationsState, action: PayloadAction<string>) => {
      state.currentLanguage.code = action.payload;
    },
    setSiteTranslations: (state: TranslationsState, action: PayloadAction<any>) => {
      state.currentLanguage.siteTranslations = action.payload;
    },
    setFormsTranslations: (state: TranslationsState, action: PayloadAction<any>) => {
      state.currentLanguage.formsTranslations = action.payload;
    }
  },
});

export const {
  loadStart,
  loadSuccess,
  setCurrentLanguage,
  setLanguageName,
  setLanguageCode,
  setSiteTranslations,
  setFormsTranslations,
  fail,
  silentfail
} = translationsSlice.actions;

export default translationsSlice.reducer;
