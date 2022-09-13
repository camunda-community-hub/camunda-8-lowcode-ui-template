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
      for (let i = 0; i < state.organizations.length; i++) {
        state.organizations[i].oldname = state.organizations[i].name;
      }

    },
    addOrganization: (state: AdminState, action: PayloadAction<Organization>) => {
      state.loading = false;
      action.payload.oldname = action.payload.name;
      state.organizations!.push(action.payload);
    },
    updateOrganization: (state: AdminState, action: PayloadAction<Organization>) => {
      state.loading = false;
      for (let i = 0; i < state.organizations!.length; i++) {
        if (state.organizations![i].oldname == action.payload.oldname) {
          state.organizations![i] = action.payload;
          break;
        }
      }
    }
  },
});

export const {
  loadStart,
  loadSuccess,
  addOrganization,
  updateOrganization,
  fail,
  silentfail
} = adminSlice.actions;

export default adminSlice.reducer;
