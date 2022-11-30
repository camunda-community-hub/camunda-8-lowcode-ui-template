import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminDmnsState {
  dmns: string[] | null;
  currentDmn: any;
  contextData: any;
  loading: boolean;
  error: string | null;
}

const initialState: AdminDmnsState = {
  dmns: null,
  currentDmn: null,
  contextData: {},
  loading: false,
  error: null,
};

const adminDmnsSlice = createSlice({
  name: 'adminDmns',
  initialState,
  reducers: {
    loadStart: (state: AdminDmnsState) => {
      state.loading = true;
    },
    fail: (state: AdminDmnsState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    silentfail: (state: AdminDmnsState) => {
      state.loading = false;
    },
    loadSuccess: (state: AdminDmnsState, action: PayloadAction<string[]>) => {
      state.loading = false;
      state.dmns = action.payload;
    },
    setCurrentDmn: (state: AdminDmnsState, action: PayloadAction<any>) => {
      state.loading = false;
      state.currentDmn = action.payload;
      if (state.currentDmn != null) {
        state.contextData = action.payload.contextData;
      }
    }
  },
});

export const {
  loadStart,
  loadSuccess,
  setCurrentDmn,
  fail,
  silentfail
} = adminDmnsSlice.actions;

export default adminDmnsSlice.reducer;
