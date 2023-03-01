import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkersState {
  workers: any[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkersState = {
  workers: null,
  loading: false,
  error: null,
};

const connectorsSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
    loadStart: (state: WorkersState) => {
      state.loading = true;
    },
    fail: (state: WorkersState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    silentfail: (state: WorkersState) => {
      state.loading = false;
    },
    loadSuccess: (state: WorkersState, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.workers = action.payload;
    }
  },
});

export const {
  loadStart,
  loadSuccess,
  fail,
  silentfail
} = connectorsSlice.actions;

export default connectorsSlice.reducer;
