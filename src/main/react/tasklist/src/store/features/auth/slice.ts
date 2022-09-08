import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUser} from '../../model';

interface AuthState {
  data: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    authStart: (state: AuthState) => {
      state.loading = true;
    },
    fail: (state: AuthState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    silentfail: (state: AuthState) => {
      state.loading = false;
    },
    signInSuccess: (state: AuthState, action: PayloadAction<IUser>) => {
      state.loading = false;
      state.data = action.payload;
    },
    signOutSuccess: (state: AuthState) => {
      state.data = null;
    },
  },
});

export const {
  authStart,
  signInSuccess,
  signOutSuccess,
  fail,
  silentfail
} = counterSlice.actions;

export default counterSlice.reducer;