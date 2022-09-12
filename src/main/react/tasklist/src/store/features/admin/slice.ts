import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Organization} from '../../model';

interface AdminState {
  organizations: Organization[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  organizations: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loadStart: (state: AdminState) => {
      state.loading = true;
    },
    fail: (state: AdminState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    silentfail: (state: AdminState) => {
      state.loading = false;
    },
    loadSuccess: (state: AdminState, action: PayloadAction<Organization[]>) => {
      state.loading = false;
      state.organizations = action.payload;
    },
    addOrganization: (state: AdminState, action: PayloadAction<Organization>) => {
      state.loading = false;
      state.organizations!.push(action.payload);
    },
  },
});

export const {
  loadStart,
  loadSuccess,
  addOrganization,
  fail,
  silentfail
} = adminSlice.actions;

export default adminSlice.reducer;
